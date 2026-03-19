import React, { useState, useEffect, useRef } from 'react';
import type { Project, MediaItem, ProjectLink, TechStackGroup } from '../../types';
import { slugify, genId, ImageUploadBtn, UploadBtn, TagInput } from './shared';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
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
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

// ── Helpers ───────────────────────────────────────────────────────────────────

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

// ── Rich Text Toolbar ─────────────────────────────────────────────────────────

function RichTextToolbar() {
  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
  }

  function insertLink() {
    const url = window.prompt('Enter URL:');
    if (url) exec('createLink', url);
  }

  function insertImage() {
    const url = window.prompt('Enter image URL:');
    if (url) exec('insertImage', url);
  }

  const buttons: { label: string; title: string; action: () => void }[] = [
    { label: 'B', title: 'Bold', action: () => exec('bold') },
    { label: 'I', title: 'Italic', action: () => exec('italic') },
    { label: 'U', title: 'Underline', action: () => exec('underline') },
    { label: 'H1', title: 'Heading 1', action: () => exec('formatBlock', 'h1') },
    { label: 'H2', title: 'Heading 2', action: () => exec('formatBlock', 'h2') },
    { label: 'H3', title: 'Heading 3', action: () => exec('formatBlock', 'h3') },
    { label: 'P', title: 'Paragraph', action: () => exec('formatBlock', 'p') },
    { label: 'UL', title: 'Bullet list', action: () => exec('insertUnorderedList') },
    { label: 'OL', title: 'Numbered list', action: () => exec('insertOrderedList') },
    { label: '🔗', title: 'Insert link', action: insertLink },
    { label: '🖼', title: 'Insert image', action: insertImage },
    { label: '—', title: 'Horizontal rule', action: () => exec('insertHorizontalRule') },
    { label: '✕', title: 'Remove formatting', action: () => exec('removeFormat') },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mb: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
      {buttons.map((btn) => (
        <Tooltip key={btn.title} title={btn.title} arrow>
          <Button
            size="small"
            variant="text"
            onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
            sx={{
              minWidth: 32,
              px: 0.75,
              py: 0.25,
              fontSize: '0.75rem',
              fontWeight: btn.label.length <= 2 ? 700 : 400,
              fontStyle: btn.label === 'I' ? 'italic' : 'normal',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {btn.label}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}

// ── Media Gallery Editor ──────────────────────────────────────────────────────

function MediaGalleryEditor({
  items,
  onChange,
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}) {
  function addItem() {
    onChange([...items, { type: 'image', src: '', alt: '' }]);
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, updates: Partial<MediaItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...updates };
    onChange(next);
  }

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
        Media Gallery ({items.length})
      </Typography>

      {items.length === 0 && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1.5, fontStyle: 'italic' }}>
          No gallery items yet. Add images or videos to show on the project detail page.
        </Typography>
      )}

      <Stack spacing={1.5}>
        {items.map((item, i) => (
          <Paper
            key={i}
            variant="outlined"
            sx={{ p: 1.5, borderRadius: 1.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                  #{i + 1}
                </Typography>
                <IconButton size="small" onClick={() => moveItem(i, -1)} disabled={i === 0} sx={{ color: 'text.secondary' }}>
                  <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton size="small" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} sx={{ color: 'text.secondary' }}>
                  <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <IconButton size="small" onClick={() => removeItem(i)} color="error">
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1, mb: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={item.type}
                  onChange={(e) => updateItem(i, { type: e.target.value as MediaItem['type'] })}
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="iframe">iFrame</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Alt text"
                value={item.alt ?? ''}
                onChange={(e) => updateItem(i, { alt: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                label="Source URL"
                value={item.src}
                onChange={(e) => updateItem(i, { src: e.target.value })}
                placeholder="https://... or /assets/file.jpg"
              />
              {item.type === 'image' && (
                <ImageUploadBtn onUrl={(url) => updateItem(i, { src: url })} />
              )}
              {item.type === 'video' && (
                <UploadBtn
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  label="Upload"
                  onUrl={(url) => updateItem(i, { src: url })}
                />
              )}
            </Box>

            {/* Preview */}
            {item.src && item.type === 'image' && (
              <Box
                component="img"
                src={item.src}
                alt={item.alt ?? ''}
                sx={{ mt: 1, height: 64, width: 'auto', borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
              />
            )}
            {item.src && item.type === 'video' && (
              <Box
                component="video"
                src={item.src}
                muted
                loop
                playsInline
                sx={{ mt: 1, height: 64, width: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider', objectFit: 'cover' }}
              />
            )}
          </Paper>
        ))}
      </Stack>

      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={addItem}
        sx={{ mt: 1.5, alignSelf: 'flex-start', color: 'primary.main' }}
      >
        Add Gallery Item
      </Button>
    </Box>
  );
}

// ── Project Form ──────────────────────────────────────────────────────────────

export function ProjectForm({
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
                  <Box>
                    <RichTextToolbar />
                    <Box
                      ref={richEditorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => set('content', e.currentTarget.innerHTML)}
                      className="prose"
                      sx={{
                        minHeight: 720,
                        maxHeight: { xs: 560, lg: 'calc(100vh - 280px)' },
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
                  </Box>
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

            {/* Media Gallery */}
            <MediaGalleryEditor
              items={p.mediaGallery}
              onChange={(items) => set('mediaGallery', items)}
            />

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
