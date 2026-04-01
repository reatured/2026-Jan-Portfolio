const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = 3001;
const MAX_HISTORY = 20;
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || '';
const ALLOWED_ORIGINS = (process.env.ADMIN_CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const DATA_FILE = path.join(__dirname, '../config/data.json');
const RICH_CONTENT_FILE = path.join(__dirname, '../config/richContent.json');
const HISTORY_FILE = path.join(__dirname, './history.json');
const ASSETS_DIR = path.join(__dirname, '../public/assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: '10mb' }));
app.use('/assets', express.static(ASSETS_DIR));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: ASSETS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB — enough for short video clips
  fileFilter: (_req, file, cb) => {
    const allowed = /image\/(jpeg|png|gif|webp|svg\+xml)|video\/(mp4|webm|ogg|quicktime)/;
    cb(null, allowed.test(file.mimetype));
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Atomic write: write to temp file in same directory, then rename. */
function atomicWriteSync(filePath, data) {
  const dir = path.dirname(filePath);
  const tmp = path.join(dir, `.tmp-${path.basename(filePath)}-${process.pid}-${Date.now()}`);
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, filePath);
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function readRichContent() {
  try {
    return JSON.parse(fs.readFileSync(RICH_CONTENT_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function withEffectiveProjectContent(data) {
  const richContent = readRichContent();
  return {
    ...data,
    projects: (data.projects || []).map((project) => ({
      ...project,
      content: sanitizeHtml(project.content || richContent[project.id] || ''),
    })),
  };
}

function sanitizeHtml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*("|')\s*javascript:[\s\S]*?\2/gi, '');
}

function requireAdminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return next();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid admin token.' });
  }
  next();
}

function writeData(data) {
  atomicWriteSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeHistory(history) {
  atomicWriteSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

/** Save a snapshot of a project before it's overwritten. */
function snapshotProject(projectId, projectData) {
  const history = readHistory();
  if (!history[projectId]) history[projectId] = [];

  history[projectId].unshift({
    savedAt: new Date().toISOString(),
    snapshot: projectData,
  });

  // Keep only the last MAX_HISTORY versions
  if (history[projectId].length > MAX_HISTORY) {
    history[projectId] = history[projectId].slice(0, MAX_HISTORY);
  }

  writeHistory(history);
}

/** Validate required project fields. Returns an error string or null. */
function validateProject(body) {
  if (!body || typeof body !== 'object') return 'Request body must be a JSON object';
  const required = ['id', 'slug', 'title', 'shortSubtitle', 'summary'];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
      return `Missing required field: ${field}`;
    }
  }
  if (!Array.isArray(body.categories)) return 'categories must be an array';
  if (!Array.isArray(body.rolesOrSkills)) return 'rolesOrSkills must be an array';
  if (!Array.isArray(body.techStack)) return 'techStack must be an array';
  if (!body.featuredMedia || typeof body.featuredMedia !== 'object') return 'featuredMedia is required';
  if (!['image', 'video', 'iframe'].includes(body.featuredMedia.type)) {
    return 'featuredMedia.type must be image, video, or iframe';
  }
  if (!Array.isArray(body.mediaGallery)) return 'mediaGallery must be an array';
  if (!Array.isArray(body.links)) return 'links must be an array';
  if (typeof body.isFeatured !== 'boolean') return 'isFeatured must be a boolean';
  return null;
}

// ── Projects ──────────────────────────────────────────────────────────────────

app.get('/api/data', (req, res) => {
  try {
    const data = readData();
    res.json(withEffectiveProjectContent(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/projects', requireAdminAuth, (req, res) => {
  try {
    const err = validateProject(req.body);
    if (err) return res.status(400).json({ error: err });

    const data = readData();
    // Ensure no duplicate ID
    if (data.projects.some((p) => p.id === req.body.id)) {
      return res.status(409).json({ error: `Project with id "${req.body.id}" already exists` });
    }
    data.projects.unshift({ ...req.body, content: sanitizeHtml(req.body.content || '') });
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:id', requireAdminAuth, (req, res) => {
  try {
    const err = validateProject(req.body);
    if (err) return res.status(400).json({ error: err });

    const data = readData();
    const idx = data.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    // Snapshot old version before overwriting
    snapshotProject(req.params.id, data.projects[idx]);

    data.projects[idx] = { ...req.body, content: sanitizeHtml(req.body.content || '') };
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/projects/:id', requireAdminAuth, (req, res) => {
  try {
    const data = readData();
    const project = data.projects.find((p) => p.id === req.params.id);
    if (project) snapshotProject(req.params.id, project);

    data.projects = data.projects.filter((p) => p.id !== req.params.id);
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** PUT /api/projects/reorder — body: { ids: string[] } — reorder projects */
app.put('/api/projects/reorder', requireAdminAuth, (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' });

    const data = readData();
    const byId = new Map(data.projects.map((p) => [p.id, p]));

    // Reorder: place projects in the order of ids, append any not listed
    const reordered = [];
    for (const id of ids) {
      const p = byId.get(id);
      if (p) {
        reordered.push(p);
        byId.delete(id);
      }
    }
    // Append remaining projects not in the ids array
    for (const p of byId.values()) {
      reordered.push(p);
    }

    data.projects = reordered;
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── History ───────────────────────────────────────────────────────────────────

/** GET /api/history/:id — list of saved versions for a project */
app.get('/api/history/:id', (req, res) => {
  const history = readHistory();
  res.json(history[req.params.id] || []);
});

/** POST /api/history/:id/restore — body: { savedAt } — restore a snapshot */
app.post('/api/history/:id/restore', requireAdminAuth, (req, res) => {
  try {
    const { savedAt } = req.body;
    const history = readHistory();
    const versions = history[req.params.id] || [];
    const entry = versions.find((v) => v.savedAt === savedAt);
    if (!entry) return res.status(404).json({ error: 'Version not found' });

    const data = readData();
    const idx = data.projects.findIndex((p) => p.id === req.params.id);

    // Snapshot current version before restoring
    if (idx !== -1) snapshotProject(req.params.id, data.projects[idx]);

    if (idx !== -1) {
      data.projects[idx] = entry.snapshot;
    } else {
      data.projects.unshift(entry.snapshot);
    }

    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Site Config ───────────────────────────────────────────────────────────────

app.put('/api/site', requireAdminAuth, (req, res) => {
  try {
    const data = readData();
    data.site = req.body;
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Image Upload ──────────────────────────────────────────────────────────────

app.post('/api/upload', requireAdminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: `/assets/${req.file.filename}` });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  Admin server running at http://localhost:${PORT}`);
  console.log(`  Assets saved to: ${ASSETS_DIR}`);
  console.log(`  History file:    ${HISTORY_FILE}\n`);
});
