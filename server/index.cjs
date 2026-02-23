const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const MAX_HISTORY = 20;

const DATA_FILE = path.join(__dirname, '../config/data.json');
const HISTORY_FILE = path.join(__dirname, './history.json');
const ASSETS_DIR = path.join(__dirname, '../public/assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
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

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
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

// ── Projects ──────────────────────────────────────────────────────────────────

app.get('/api/data', (req, res) => {
  try {
    res.json(readData());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const data = readData();
    data.projects.unshift(req.body);
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const data = readData();
    const idx = data.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    // Snapshot old version before overwriting
    snapshotProject(req.params.id, data.projects[idx]);

    data.projects[idx] = req.body;
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
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

// ── History ───────────────────────────────────────────────────────────────────

/** GET /api/history/:id — list of saved versions for a project */
app.get('/api/history/:id', (req, res) => {
  const history = readHistory();
  res.json(history[req.params.id] || []);
});

/** POST /api/history/:id/restore — body: { savedAt } — restore a snapshot */
app.post('/api/history/:id/restore', (req, res) => {
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

app.put('/api/site', (req, res) => {
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

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: `/assets/${req.file.filename}` });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  Admin server running at http://localhost:${PORT}`);
  console.log(`  Assets saved to: ${ASSETS_DIR}`);
  console.log(`  History file:    ${HISTORY_FILE}\n`);
});
