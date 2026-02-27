import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Project, SiteConfig, MediaItem, ProjectLink, TechStackGroup } from '../types';

// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

const API = 'http://localhost:3001';

// ── Utility ───────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function genId() {
  return Date.now().toString(36);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  savedAt: string;
  snapshot: Project;
}

// ── Default blank project ─────────────────────────────────────────────────────

function blankProject(): Project {
  return {
    id: genId(),
    slug: '',
    title: '',
    year: new Date().getFullYear().toString(),
    status: '',
    shortSubtitle: '',
    summary: '',
    content: '',
    categories: [],
    rolesOrSkills: [],
    techStack: [{ category: '', skills: [] }],
    featuredMedia: { type: 'image', src: '', alt: '' },
    thumbnail: '',
    mediaGallery: [],
    links: [],
    isFeatured: false,
    section: 'Most Recent',
  };
}

// ── Upload helper ─────────────────────────────────────────────────────────────

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}/api/upload`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json.path as string;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  const isErr = msg.startsWith('Error');
  return (
    <Snackbar
      open={!!msg}
      onClose={onDone}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={isErr ? 'error' : 'success'} onClose={onDone} variant="filled" sx={{ fontWeight: 500 }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}

// ── Upload Button ─────────────────────────────────────────────────────────────

function UploadBtn({ onUrl, accept = 'image/*', label = 'Upload' }: { onUrl: (url: string) => void; accept?: string; label?: string }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadImage(file);
      onUrl(path);
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={handle} />
      <Button
        variant="outlined"
        size="small"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {uploading ? 'Uploading…' : label}
      </Button>
    </>
  );
}

function ImageUploadBtn({ onUrl }: { onUrl: (url: string) => void }) {
  return <UploadBtn onUrl={onUrl} accept="image/*" />;
}

// ── Tag Input ─────────────────────────────────────────────────────────────────

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');

  function add() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput('');
  }

  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1, minHeight: 24 }}>
        {values.map((v) => (
          <Chip
            key={v}
            label={v}
            size="small"
            onDelete={() => onChange(values.filter((x) => x !== v))}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter"
        />
        <Button variant="outlined" size="small" onClick={add} sx={{ flexShrink: 0 }}>Add</Button>
      </Box>
    </Box>
  );
}

// ── History Modal ─────────────────────────────────────────────────────────────

function HistoryModal({
  project,
  onRestore,
  onClose,
}: {
  project: Project;
  onRestore: (savedAt: string) => Promise<void>;
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/history/${project.id}`)
      .then((r) => r.json())
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [project.id]);

  async function handleRestore(savedAt: string) {
    if (!window.confirm(`Restore this version from ${formatDate(savedAt)}?\n\nThe current version will be saved to history first.`)) return;
    setRestoring(savedAt);
    try {
      await onRestore(savedAt);
      onClose();
    } finally {
      setRestoring(null);
    }
  }

  function diffSummary(snap: Project): string[] {
    const lines: string[] = [];
    if (snap.title) lines.push(`Title: ${snap.title}`);
    if (snap.status) lines.push(`Status: ${snap.status}`);
    if (snap.section) lines.push(`Section: ${snap.section}`);
    lines.push(`Featured: ${snap.isFeatured ? 'Yes' : 'No'}`);
    lines.push(`Media: ${snap.featuredMedia.type} — ${snap.featuredMedia.src?.slice(0, 50)}…`);
    return lines;
  }

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose} PaperProps={{ sx: { bgcolor: 'background.paper' } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Version History
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{project.title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && entries.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 0.5 }}>No version history yet.</Typography>
            <Typography variant="caption" color="text.disabled">
              History is saved automatically each time you save a project.
            </Typography>
          </Box>
        )}

        {!loading && entries.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              {entries.length} saved version{entries.length !== 1 ? 's' : ''} (newest first)
            </Typography>
            <Stack spacing={1}>
              {entries.map((entry, i) => (
                <Box
                  key={entry.savedAt}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}
                >
                  <Box
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      px: 2, py: 1.5, bgcolor: 'action.hover', cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                    onClick={() => setExpanded(expanded === entry.savedAt ? null : entry.savedAt)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', width: 20, textAlign: 'right' }}>
                        {i + 1}
                      </Typography>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>{formatDate(entry.savedAt)}</Typography>
                          {i === 0 && (
                            <Chip label="latest backup" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={(e) => { e.stopPropagation(); handleRestore(entry.savedAt); }}
                        disabled={restoring === entry.savedAt}
                      >
                        {restoring === entry.savedAt ? 'Restoring…' : 'Restore'}
                      </Button>
                      <Typography variant="caption" color="text.disabled">
                        {expanded === entry.savedAt ? '▲' : '▼'}
                      </Typography>
                    </Box>
                  </Box>

                  {expanded === entry.savedAt && (
                    <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                      {diffSummary(entry.snapshot).map((line) => (
                        <Typography key={line} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', color: 'text.secondary' }}>
                          {line}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Project Form ──────────────────────────────────────────────────────────────

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Project;
  onSave: (p: Project) => Promise<void>;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Project>({ ...initial });
  const [saving, setSaving] = useState(false);
  const [contentEditorMode, setContentEditorMode] = useState<'html' | 'rich'>('html');
  const richEditorRef = useRef<HTMLDivElement | null>(null);

  function set<K extends keyof Project>(key: K, val: Project[K]) {
    setP((prev) => ({ ...prev, [key]: val }));
  }

  function setMedia<K extends keyof MediaItem>(key: K, val: MediaItem[K]) {
    setP((prev) => ({ ...prev, featuredMedia: { ...prev.featuredMedia, [key]: val } }));
  }

  function setLink(i: number, key: keyof ProjectLink, val: string) {
    const links = [...p.links];
    links[i] = { ...links[i], [key]: val };
    set('links', links);
  }

  function addLink() { set('links', [...p.links, { label: '', url: '' }]); }
  function removeLink(i: number) { set('links', p.links.filter((_, idx) => idx !== i)); }

  function setTechGroup(i: number, key: keyof TechStackGroup, val: string | string[]) {
    const ts = [...p.techStack];
    ts[i] = { ...ts[i], [key]: val };
    set('techStack', ts);
  }

  function addTechGroup() { set('techStack', [...p.techStack, { category: '', skills: [] }]); }
  function removeTechGroup(i: number) { set('techStack', p.techStack.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(p); } finally { setSaving(false); }
  }

  const needsThumbnail = p.featuredMedia.type === 'video' || p.featuredMedia.type === 'iframe';

  useEffect(() => {
    if (contentEditorMode !== 'rich' || !richEditorRef.current) return;
    const next = p.content ?? '';
    if (richEditorRef.current.innerHTML !== next) {
      richEditorRef.current.innerHTML = next;
    }
  }, [contentEditorMode, p.content]);

  return (
    <Dialog
      open
      fullWidth
      maxWidth={false}
      onClose={onCancel}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          width: 'min(98vw, 1880px)',
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {initial.slug ? 'Edit Project' : 'New Project'}
        <IconButton onClick={onCancel} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: 'hidden' }}>
        <Box
          component="form"
          id="project-form"
          onSubmit={handleSubmit}
          sx={{ height: { xs: 'auto', lg: 'calc(100vh - 200px)' } }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.65fr 1fr' },
              gap: 3,
              pt: 1,
              height: '100%',
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                minHeight: 0,
                overflowY: { xs: 'visible', lg: 'auto' },
                pr: { lg: 0.5 },
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 1 }}>
                Detail Page Content Editor
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Optional. Overrides the built-in rich content for this project's detail page.
              </Typography>

              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>Editor</Typography>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={contentEditorMode}
                    onChange={(_e, mode) => mode && setContentEditorMode(mode)}
                  >
                    <ToggleButton value="html">HTML</ToggleButton>
                    <ToggleButton value="rich">Rich Text</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {contentEditorMode === 'html' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={34}
                    value={p.content ?? ''}
                    onChange={(e) => set('content', e.target.value)}
                    placeholder="<div>...</div>"
                    inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.75rem' } }}
                  />
                ) : (
                  <Box
                    ref={richEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => set('content', e.currentTarget.innerHTML)}
                    className="prose"
                    sx={{
                      minHeight: 760,
                      maxHeight: { xs: 560, lg: 'calc(100vh - 240px)' },
                      overflowY: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      '&:focus': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 1,
                      },
                    }}
                  />
                )}
              </Paper>
            </Box>

            <Stack
              spacing={4}
              sx={{
                minHeight: 0,
                overflowY: { xs: 'visible', lg: 'auto' },
                pr: { lg: 0.5 },
              }}
            >

            {/* Basic Info */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Basic Info
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Title *"
                  required
                  fullWidth
                  value={p.title}
                  onChange={(e) => { set('title', e.target.value); if (!initial.slug) set('slug', slugify(e.target.value)); }}
                  placeholder="Project title"
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="ID" value={p.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. 42" />
                  <TextField label="Slug" value={p.slug} onChange={(e) => set('slug', e.target.value)} placeholder="url-friendly-slug" />
                  <TextField label="Year" value={p.year ?? ''} onChange={(e) => set('year', e.target.value)} placeholder="2025" />
                  <TextField label="Status" value={p.status ?? ''} onChange={(e) => set('status', e.target.value)} placeholder="Live / Completed / etc." />
                </Box>
                <TextField
                  label="Short Subtitle *"
                  required
                  fullWidth
                  value={p.shortSubtitle}
                  onChange={(e) => set('shortSubtitle', e.target.value)}
                  placeholder="One-line descriptor"
                />
                <TextField
                  label="Summary *"
                  required
                  fullWidth
                  multiline
                  rows={3}
                  value={p.summary}
                  onChange={(e) => set('summary', e.target.value)}
                  placeholder="2–4 sentence summary"
                />
              </Stack>
            </Box>

            <Divider />

            {/* Settings */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Settings
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'center' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Section</InputLabel>
                  <Select
                    label="Section"
                    value={p.section ?? 'Most Recent'}
                    onChange={(e) => set('section', e.target.value as Project['section'])}
                  >
                    <MenuItem value="Current Projects">Current Projects</MenuItem>
                    <MenuItem value="Most Recent">Most Recent</MenuItem>
                    <MenuItem value="Archive">Archive</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={p.isFeatured}
                      onChange={(e) => set('isFeatured', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Featured project"
                />
              </Box>
            </Box>

            <Divider />

            {/* Categories & Skills */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Categories &amp; Skills
              </Typography>
              <Stack spacing={2}>
                <TagInput label="Categories" values={p.categories} onChange={(v) => set('categories', v)} />
                <TagInput label="Roles / Skills" values={p.rolesOrSkills} onChange={(v) => set('rolesOrSkills', v)} />
              </Stack>
            </Box>

            <Divider />

            {/* Featured Media */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Featured Media
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      label="Type"
                      value={p.featuredMedia.type}
                      onChange={(e) => setMedia('type', e.target.value as MediaItem['type'])}
                    >
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="iframe">iFrame / Embed</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Alt Text"
                    value={p.featuredMedia.alt ?? ''}
                    onChange={(e) => setMedia('alt', e.target.value)}
                    placeholder="Describe the media"
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>Source URL</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={p.featuredMedia.src}
                      onChange={(e) => setMedia('src', e.target.value)}
                      placeholder="https://... or /assets/filename.jpg"
                    />
                    {p.featuredMedia.type === 'image' && (
                      <ImageUploadBtn onUrl={(url) => setMedia('src', url)} />
                    )}
                  </Box>
                  {p.featuredMedia.src && p.featuredMedia.type === 'image' && (
                    <Box
                      component="img"
                      src={p.featuredMedia.src}
                      alt=""
                      sx={{ mt: 1, height: 96, width: 'auto', borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                    />
                  )}
                </Box>

                {p.featuredMedia.type === 'iframe' && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      label="Height (px)"
                      type="number"
                      value={p.featuredMedia.height ?? ''}
                      onChange={(e) => setMedia('height', Number(e.target.value))}
                      placeholder="600"
                    />
                    <TextField
                      label="Allow (permissions)"
                      value={p.featuredMedia.allow ?? ''}
                      onChange={(e) => setMedia('allow', e.target.value)}
                      placeholder="camera; microphone"
                    />
                  </Box>
                )}

                {/* Card Thumbnail */}
                {needsThumbnail && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Card Thumbnail
                      </Typography>
                      <Chip
                        label={`Required for ${p.featuredMedia.type}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                      Project cards can't display a {p.featuredMedia.type} inline. Upload a still image <em>or a short video clip</em> to show on the card.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={p.thumbnail ?? ''}
                        onChange={(e) => set('thumbnail', e.target.value)}
                        placeholder="https://... or /assets/thumbnail.mp4"
                      />
                      <UploadBtn
                        accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                        label="Upload"
                        onUrl={(url) => set('thumbnail', url)}
                      />
                    </Box>
                    {p.thumbnail && (() => {
                      const ytId = getYouTubeId(p.thumbnail);
                      const isVid = isVideoUrl(p.thumbnail);
                      return (
                        <Box sx={{ mt: 1.5 }}>
                          {ytId ? (
                            <Box sx={{ position: 'relative', height: 80, width: 128, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                              <Box component="img" src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} alt="YouTube thumbnail" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ width: 28, height: 28, bgcolor: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                </Box>
                              </Box>
                            </Box>
                          ) : isVid ? (
                            <Box component="video" src={p.thumbnail} autoPlay muted loop playsInline sx={{ height: 80, width: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider', objectFit: 'cover' }} />
                          ) : (
                            <Box component="img" src={p.thumbnail} alt="thumbnail preview" sx={{ height: 80, width: 'auto', borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }} />
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {ytId ? 'YouTube thumbnail — shows poster + play badge on card' : isVid ? 'Video thumbnail — will autoplay muted on card' : 'Image thumbnail'}
                          </Typography>
                        </Box>
                      );
                    })()}
                    {!p.thumbnail && (
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                        No thumbnail set — the site default image will be used on cards.
                      </Typography>
                    )}
                  </Paper>
                )}
              </Stack>
            </Box>

            <Divider />

            {/* Links */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Links
              </Typography>
              <Stack spacing={1.5}>
                {p.links.map((lnk, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                    <TextField size="small" value={lnk.label} onChange={(e) => setLink(i, 'label', e.target.value)} placeholder="Label (e.g. Live Demo)" sx={{ width: '35%' }} />
                    <TextField size="small" fullWidth value={lnk.url} onChange={(e) => setLink(i, 'url', e.target.value)} placeholder="https://..." />
                    <IconButton size="small" onClick={() => removeLink(i)} color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={addLink}
                  sx={{ alignSelf: 'flex-start', color: 'primary.main' }}
                >
                  Add Link
                </Button>
              </Stack>
            </Box>

            <Divider />

            {/* Tech Stack */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
                Tech Stack
              </Typography>
              <Stack spacing={1.5}>
                {p.techStack.map((grp, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField size="small" value={grp.category} onChange={(e) => setTechGroup(i, 'category', e.target.value)} placeholder="Category" sx={{ width: '35%' }} />
                    <TextField
                      size="small"
                      fullWidth
                      value={grp.skills.join(', ')}
                      onChange={(e) => setTechGroup(i, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                      placeholder="Skill1, Skill2, Skill3"
                    />
                    <IconButton size="small" onClick={() => removeTechGroup(i)} color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={addTechGroup}
                  sx={{ alignSelf: 'flex-start', color: 'primary.main' }}
                >
                  Add Group
                </Button>
              </Stack>
            </Box>

            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button
          type="submit"
          form="project-form"
          variant="contained"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Site Config Form ──────────────────────────────────────────────────────────

const SOCIAL_ICON_OPTIONS = [
  { label: 'GitHub', value: 'GitHub' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Email / Mail', value: 'Email' },
  { label: 'Link (generic)', value: 'Link' },
];

function SiteConfigForm({ initial, onSave }: { initial: SiteConfig; onSave: (s: SiteConfig) => Promise<void> }) {
  const [s, setS] = useState<SiteConfig>({ ...initial });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteConfig>(key: K, val: SiteConfig[K]) {
    setS((prev) => ({ ...prev, [key]: val }));
  }

  function setSocialLink(i: number, key: keyof typeof s.socialLinks[0], val: string) {
    const links = [...s.socialLinks];
    links[i] = { ...links[i], [key]: val };
    set('socialLinks', links);
  }

  function addSocialLink() {
    set('socialLinks', [...s.socialLinks, { platform: '', url: '', icon: 'Link' }]);
  }

  function removeSocialLink(i: number) {
    set('socialLinks', s.socialLinks.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(s); } finally { setSaving(false); }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>

        {/* Identity */}
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
            Identity
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Site Name" fullWidth value={s.siteName} onChange={(e) => set('siteName', e.target.value)} />
              <TextField label="Job Title" fullWidth value={s.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
              <TextField label="Email" type="email" fullWidth value={s.email} onChange={(e) => set('email', e.target.value)} />
              <TextField label="Location" fullWidth value={s.location} onChange={(e) => set('location', e.target.value)} />
            </Box>
            <TextField label="Bio (line breaks supported)" fullWidth multiline rows={4} value={s.bio} onChange={(e) => set('bio', e.target.value)} />
          </Stack>
        </Box>

        <Divider />

        {/* Social Links */}
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
            Social Links
          </Typography>
          <Stack spacing={1.5}>
            {s.socialLinks.map((link, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr auto', gap: 1, alignItems: 'center' }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Icon</InputLabel>
                  <Select
                    label="Icon"
                    value={link.icon}
                    onChange={(e) => setSocialLink(i, 'icon', e.target.value)}
                  >
                    {SOCIAL_ICON_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  label="Platform name"
                  value={link.platform}
                  onChange={(e) => setSocialLink(i, 'platform', e.target.value)}
                  placeholder="e.g. GitHub"
                />
                <TextField
                  size="small"
                  fullWidth
                  label="URL"
                  value={link.url}
                  onChange={(e) => setSocialLink(i, 'url', e.target.value)}
                  placeholder="https://..."
                />
                <IconButton size="small" color="error" onClick={() => removeSocialLink(i)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={addSocialLink}
              sx={{ alignSelf: 'flex-start', color: 'primary.main' }}
            >
              Add Social Link
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* Images */}
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
            Images
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>Avatar URL</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField size="small" fullWidth value={s.avatar} onChange={(e) => set('avatar', e.target.value)} />
                <ImageUploadBtn onUrl={(url) => set('avatar', url)} />
                {s.avatar && (
                  <Box component="img" src={s.avatar} alt="" sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid', borderColor: 'divider', flexShrink: 0 }} />
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>Default OG Image URL</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField size="small" fullWidth value={s.defaultOgImage} onChange={(e) => set('defaultOgImage', e.target.value)} />
                <ImageUploadBtn onUrl={(url) => set('defaultOgImage', url)} />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* SEO */}
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
            SEO
          </Typography>
          <Stack spacing={2}>
            <TextField label="Default Title" fullWidth value={s.defaultTitle} onChange={(e) => set('defaultTitle', e.target.value)} />
            <TextField label="Default Description" fullWidth multiline rows={2} value={s.defaultDescription} onChange={(e) => set('defaultDescription', e.target.value)} />
            <TextField
              label="Keywords (comma-separated)"
              fullWidth
              value={s.keywords.join(', ')}
              onChange={(e) => set('keywords', e.target.value.split(',').map((k) => k.trim()).filter(Boolean))}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Twitter Handle" fullWidth value={s.twitterHandle} onChange={(e) => set('twitterHandle', e.target.value)} />
              <TextField label="Site URL" type="url" fullWidth value={s.siteUrl} onChange={(e) => set('siteUrl', e.target.value)} />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ pt: 1 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save Site Config'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

// ── Projects Table ────────────────────────────────────────────────────────────

function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onHistory,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onHistory: (p: Project) => void;
}) {
  const sectionOrder = ['Current Projects', 'Most Recent', 'Archive'];
  const sorted = [...projects].sort((a, b) => {
    const ai = sectionOrder.indexOf(a.section ?? 'Most Recent');
    const bi = sectionOrder.indexOf(b.section ?? 'Most Recent');
    return ai - bi;
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ID</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Section</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</TableCell>
            <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>★</TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{p.id}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>{p.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  <Typography variant="caption" color="text.secondary">{p.shortSubtitle}</Typography>
                  {(p.featuredMedia.type === 'video' || p.featuredMedia.type === 'iframe') && (
                    <Chip
                      label={p.thumbnail ? '✓ thumbnail' : '! no thumbnail'}
                      size="small"
                      color={p.thumbnail ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ height: 16, fontSize: '0.6rem' }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={p.section ?? 'Most Recent'}
                  size="small"
                  color={p.section === 'Current Projects' ? 'primary' : 'default'}
                  variant={p.section === 'Archive' ? 'outlined' : 'filled'}
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">{p.status ?? '—'}</Typography>
              </TableCell>
              <TableCell align="center">
                {p.isFeatured && <Typography sx={{ color: 'warning.main' }}>★</Typography>}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={() => onHistory(p)} title="Version history" sx={{ color: 'text.secondary' }}>
                    <HistoryIcon fontSize="small" />
                  </IconButton>
                  <Button size="small" variant="outlined" onClick={() => onEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={() => { if (window.confirm(`Delete "${p.title}"?`)) onDelete(p.id); }}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export function Admin() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [historyProject, setHistoryProject] = useState<Project | null>(null);
  const [toast, setToast] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/data`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects);
      setSite(data.site);
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showToast(msg: string) { setToast(msg); }

  async function handleSaveProject(p: Project) {
    const isNew = !projects.find((x) => x.id === p.id);
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API}/api/projects` : `${API}/api/projects/${p.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    if (!res.ok) throw new Error('Save failed');
    await fetchData();
    setShowForm(false);
    setEditProject(null);
    showToast('Project saved!');
  }

  async function handleDeleteProject(id: string) {
    const res = await fetch(`${API}/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) { showToast('Error: Delete failed'); return; }
    await fetchData();
    showToast('Project deleted.');
  }

  async function handleSaveSite(s: SiteConfig) {
    const res = await fetch(`${API}/api/site`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
    if (!res.ok) throw new Error('Save failed');
    await fetchData();
    showToast('Site config saved!');
  }

  async function handleRestore(projectId: string, savedAt: string) {
    const res = await fetch(`${API}/api/history/${projectId}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAt }),
    });
    if (!res.ok) throw new Error('Restore failed');
    await fetchData();
    showToast('Version restored!');
  }

  function openNew() { setEditProject(blankProject()); setShowForm(true); }
  function openEdit(p: Project) { setEditProject(p); setShowForm(true); }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '-0.01em', flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Chip
            label={connected ? 'Server connected' : 'Server offline'}
            size="small"
            color={connected ? 'success' : 'error'}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Button component={Link} to="/" color="inherit" size="small" sx={{ color: 'text.secondary' }}>
            ← Back to site
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 20, gap: 2 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Connecting to admin server…</Typography>
          </Box>
        )}

        {/* Not connected */}
        {!loading && !connected && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              sx={{
                p: 5, textAlign: 'center', maxWidth: 480, borderRadius: 3,
              }}
            >
              <Typography variant="h3" sx={{ mb: 2 }}>🔌</Typography>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Admin server not running</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The admin panel requires the local server to make changes. Start it in your terminal:
              </Typography>
              <Paper variant="outlined" sx={{ px: 2, py: 1.5, mb: 1, textAlign: 'left', fontFamily: 'monospace', bgcolor: 'background.default' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main' }}>npm run admin</Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary">or run both Vite + admin together:</Typography>
              <Paper variant="outlined" sx={{ px: 2, py: 1.5, mt: 1, mb: 3, textAlign: 'left', bgcolor: 'background.default' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main' }}>npm run dev:all</Typography>
              </Paper>
              <Button variant="outlined" onClick={fetchData}>Retry connection</Button>
            </Paper>
          </Box>
        )}

        {/* Connected UI */}
        {!loading && connected && (
          <>
            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Tab label={`Projects (${projects.length})`} />
              <Tab label="Site Config" />
            </Tabs>

            {/* Projects Tab */}
            {tab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>Projects</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {projects.filter((p) => p.isFeatured).length} featured ·{' '}
                      {projects.filter((p) => p.section === 'Current Projects').length} current ·{' '}
                      {projects.filter((p) => p.section === 'Archive').length} archived
                    </Typography>
                  </Box>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
                    New Project
                  </Button>
                </Box>
                <Paper sx={{ borderRadius: 2 }}>
                  <ProjectsTable projects={projects} onEdit={openEdit} onDelete={handleDeleteProject} onHistory={setHistoryProject} />
                </Paper>
              </Box>
            )}

            {/* Site Config Tab */}
            {tab === 1 && site && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>Site Config</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Basic info, avatar, SEO settings.</Typography>
                </Box>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <SiteConfigForm initial={site} onSave={handleSaveSite} />
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Project Form Modal */}
      {showForm && editProject && (
        <ProjectForm
          initial={editProject}
          onSave={handleSaveProject}
          onCancel={() => { setShowForm(false); setEditProject(null); }}
        />
      )}

      {/* History Modal */}
      {historyProject && (
        <HistoryModal
          project={historyProject}
          onRestore={(savedAt) => handleRestore(historyProject.id, savedAt)}
          onClose={() => setHistoryProject(null)}
        />
      )}

      {/* Toast */}
      <Toast msg={toast} onDone={() => setToast('')} />
    </Box>
  );
}
