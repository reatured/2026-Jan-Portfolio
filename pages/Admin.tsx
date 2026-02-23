import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Project, SiteConfig, MediaItem, ProjectLink, TechStackGroup } from '../types';

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
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  if (!msg) return null;
  const isErr = msg.startsWith('Error');
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${isErr ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
      {msg}
    </div>
  );
}

// ── Image Upload Button ───────────────────────────────────────────────────────

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

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
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handle} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded border border-slate-600 whitespace-nowrap disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : label}
      </button>
    </>
  );
}

// Keep alias for image-only upload buttons elsewhere
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
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-slate-400 hover:text-white">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter"
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 placeholder-slate-500"
        />
        <button type="button" onClick={add} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded border border-slate-600">Add</button>
      </div>
    </div>
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

  // Fields to show in the diff summary
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 py-8 px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-white">Version History</h2>
            <p className="text-sm text-slate-400 mt-0.5">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-4">
          {loading && <p className="text-slate-400 text-sm py-4 text-center">Loading history…</p>}

          {!loading && entries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No version history yet.</p>
              <p className="text-slate-500 text-xs mt-1">History is saved automatically each time you save a project.</p>
            </div>
          )}

          {!loading && entries.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-4">{entries.length} saved version{entries.length !== 1 ? 's' : ''} (newest first)</p>
              {entries.map((entry, i) => (
                <div key={entry.savedAt} className="border border-slate-700 rounded-lg overflow-hidden">
                  {/* Version header row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-750 cursor-pointer" onClick={() => setExpanded(expanded === entry.savedAt ? null : entry.savedAt)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 w-5 text-right">{i + 1}</span>
                      <div>
                        <span className="text-sm text-slate-200 font-medium">{formatDate(entry.savedAt)}</span>
                        {i === 0 && <span className="ml-2 text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">latest backup</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRestore(entry.savedAt); }}
                        disabled={restoring === entry.savedAt}
                        className="text-xs px-3 py-1 bg-amber-700/60 hover:bg-amber-700 text-amber-200 rounded disabled:opacity-50"
                      >
                        {restoring === entry.savedAt ? 'Restoring…' : 'Restore'}
                      </button>
                      <span className="text-slate-500 text-sm">{expanded === entry.savedAt ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded snapshot details */}
                  {expanded === entry.savedAt && (
                    <div className="px-4 py-3 border-t border-slate-700 bg-slate-950/50">
                      <ul className="space-y-1">
                        {diffSummary(entry.snapshot).map((line) => (
                          <li key={line} className="text-xs text-slate-400 font-mono">{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Project Form ──────────────────────────────────────────────────────────────

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

  const inputCls = 'w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500';
  const labelCls = 'block text-xs text-slate-400 mb-1';

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 py-8 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{initial.slug ? 'Edit Project' : 'New Project'}</h2>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Title *</label>
                <input
                  required
                  value={p.title}
                  onChange={(e) => { set('title', e.target.value); if (!initial.slug) set('slug', slugify(e.target.value)); }}
                  className={inputCls}
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className={labelCls}>ID</label>
                <input value={p.id} onChange={(e) => set('id', e.target.value)} className={inputCls} placeholder="e.g. 42" />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input value={p.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="url-friendly-slug" />
              </div>
              <div>
                <label className={labelCls}>Year</label>
                <input value={p.year ?? ''} onChange={(e) => set('year', e.target.value)} className={inputCls} placeholder="2025" />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <input value={p.status ?? ''} onChange={(e) => set('status', e.target.value)} className={inputCls} placeholder="Live / Completed / etc." />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Short Subtitle *</label>
                <input required value={p.shortSubtitle} onChange={(e) => set('shortSubtitle', e.target.value)} className={inputCls} placeholder="One-line descriptor" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Summary *</label>
                <textarea required rows={3} value={p.summary} onChange={(e) => set('summary', e.target.value)} className={inputCls} placeholder="2–4 sentence summary" />
              </div>
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Section</label>
                <select value={p.section ?? 'Most Recent'} onChange={(e) => set('section', e.target.value as Project['section'])} className={inputCls}>
                  <option value="Current Projects">Current Projects</option>
                  <option value="Most Recent">Most Recent</option>
                  <option value="Archive">Archive</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="featured" checked={p.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <label htmlFor="featured" className="text-sm text-slate-300">Featured project</label>
              </div>
            </div>
          </section>

          {/* Categories & Skills */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Categories & Skills</h3>
            <div className="grid grid-cols-1 gap-4">
              <TagInput label="Categories" values={p.categories} onChange={(v) => set('categories', v)} />
              <TagInput label="Roles / Skills" values={p.rolesOrSkills} onChange={(v) => set('rolesOrSkills', v)} />
            </div>
          </section>

          {/* Featured Media */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Featured Media</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Type</label>
                <select value={p.featuredMedia.type} onChange={(e) => setMedia('type', e.target.value as MediaItem['type'])} className={inputCls}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="iframe">iFrame / Embed</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Alt Text</label>
                <input value={p.featuredMedia.alt ?? ''} onChange={(e) => setMedia('alt', e.target.value)} className={inputCls} placeholder="Describe the media" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Source URL</label>
                <div className="flex gap-2">
                  <input
                    value={p.featuredMedia.src}
                    onChange={(e) => setMedia('src', e.target.value)}
                    className={inputCls}
                    placeholder="https://... or /assets/filename.jpg"
                  />
                  {p.featuredMedia.type === 'image' && (
                    <ImageUploadBtn onUrl={(url) => setMedia('src', url)} />
                  )}
                </div>
                {p.featuredMedia.src && p.featuredMedia.type === 'image' && (
                  <img src={p.featuredMedia.src} alt="" className="mt-2 h-24 w-auto rounded object-cover border border-slate-700" />
                )}
              </div>
              {p.featuredMedia.type === 'iframe' && (
                <>
                  <div>
                    <label className={labelCls}>Height (px)</label>
                    <input type="number" value={p.featuredMedia.height ?? ''} onChange={(e) => setMedia('height', Number(e.target.value))} className={inputCls} placeholder="600" />
                  </div>
                  <div>
                    <label className={labelCls}>Allow (permissions)</label>
                    <input value={p.featuredMedia.allow ?? ''} onChange={(e) => setMedia('allow', e.target.value)} className={inputCls} placeholder="camera; microphone" />
                  </div>
                </>
              )}
            </div>

            {/* Card Thumbnail — shown when media is video or iframe */}
            {needsThumbnail && (
              <div className="mt-4 p-4 bg-slate-800/60 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Card Thumbnail</span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded">
                    Required for {p.featuredMedia.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Project cards can't display a {p.featuredMedia.type} inline. Upload a still image <em>or a short video clip</em> to show on the card.
                </p>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      value={p.thumbnail ?? ''}
                      onChange={(e) => set('thumbnail', e.target.value)}
                      className={inputCls}
                      placeholder="https://... or /assets/thumbnail.mp4"
                    />
                    <UploadBtn
                      accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                      label="Upload"
                      onUrl={(url) => set('thumbnail', url)}
                    />
                  </div>
                  {p.thumbnail && (() => {
                    const ytId = getYouTubeId(p.thumbnail);
                    const isVid = isVideoUrl(p.thumbnail);
                    return (
                      <div className="mt-2">
                        {ytId ? (
                          <div className="relative h-20 w-32 rounded border border-slate-700 overflow-hidden">
                            <img
                              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                              alt="YouTube thumbnail"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center opacity-80">
                                <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : isVid ? (
                          <video src={p.thumbnail} autoPlay muted loop playsInline className="h-20 w-auto rounded border border-slate-700 object-cover" />
                        ) : (
                          <img src={p.thumbnail} alt="thumbnail preview" className="h-20 w-auto rounded object-cover border border-slate-700" />
                        )}
                        <p className="text-[10px] text-slate-500 mt-1">
                          {ytId ? 'YouTube thumbnail — shows poster image + play badge on card' : isVid ? 'Video thumbnail — will autoplay muted on card' : 'Image thumbnail'}
                        </p>
                      </div>
                    );
                  })()}
                  {!p.thumbnail && (
                    <p className="text-xs text-slate-500 mt-2 italic">No thumbnail set — the site default image will be used on cards.</p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Links */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Links</h3>
            <div className="space-y-2">
              {p.links.map((lnk, i) => (
                <div key={i} className="flex gap-2">
                  <input value={lnk.label} onChange={(e) => setLink(i, 'label', e.target.value)} className={inputCls} placeholder="Label (e.g. Live Demo)" />
                  <input value={lnk.url} onChange={(e) => setLink(i, 'url', e.target.value)} className={`${inputCls} flex-1`} placeholder="https://..." />
                  <button type="button" onClick={() => removeLink(i)} className="px-3 py-2 text-slate-400 hover:text-red-400 text-lg leading-none">×</button>
                </div>
              ))}
              <button type="button" onClick={addLink} className="text-xs text-blue-400 hover:text-blue-300">+ Add Link</button>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Tech Stack</h3>
            <div className="space-y-3">
              {p.techStack.map((grp, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input value={grp.category} onChange={(e) => setTechGroup(i, 'category', e.target.value)} className={`${inputCls} w-36`} placeholder="Category" />
                  <input
                    value={grp.skills.join(', ')}
                    onChange={(e) => setTechGroup(i, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                    className={`${inputCls} flex-1`}
                    placeholder="Skill1, Skill2, Skill3"
                  />
                  <button type="button" onClick={() => removeTechGroup(i)} className="px-3 py-2 text-slate-400 hover:text-red-400 text-lg leading-none">×</button>
                </div>
              ))}
              <button type="button" onClick={addTechGroup} className="text-xs text-blue-400 hover:text-blue-300">+ Add Group</button>
            </div>
          </section>

          {/* HTML Content */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Detail Page Content (HTML)</h3>
            <p className="text-xs text-slate-500 mb-3">Optional. Overrides the built-in rich content for this project's detail page.</p>
            <textarea
              rows={8}
              value={p.content ?? ''}
              onChange={(e) => set('content', e.target.value)}
              className={`${inputCls} font-mono text-xs`}
              placeholder="<div>...</div>"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Site Config Form ──────────────────────────────────────────────────────────

function SiteConfigForm({ initial, onSave }: { initial: SiteConfig; onSave: (s: SiteConfig) => Promise<void> }) {
  const [s, setS] = useState<SiteConfig>({ ...initial });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteConfig>(key: K, val: SiteConfig[K]) {
    setS((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(s); } finally { setSaving(false); }
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500';
  const labelCls = 'block text-xs text-slate-400 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Site Name</label>
            <input value={s.siteName} onChange={(e) => set('siteName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Job Title</label>
            <input value={s.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={s.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input value={s.location} onChange={(e) => set('location', e.target.value)} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Bio (line breaks supported)</label>
            <textarea rows={4} value={s.bio} onChange={(e) => set('bio', e.target.value)} className={inputCls} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Images</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Avatar URL</label>
            <div className="flex gap-2 items-center">
              <input value={s.avatar} onChange={(e) => set('avatar', e.target.value)} className={inputCls} />
              <ImageUploadBtn onUrl={(url) => set('avatar', url)} />
              {s.avatar && <img src={s.avatar} alt="" className="h-10 w-10 rounded-full object-cover border border-slate-700" />}
            </div>
          </div>
          <div>
            <label className={labelCls}>Default OG Image URL</label>
            <div className="flex gap-2 items-center">
              <input value={s.defaultOgImage} onChange={(e) => set('defaultOgImage', e.target.value)} className={inputCls} />
              <ImageUploadBtn onUrl={(url) => set('defaultOgImage', url)} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">SEO</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>Default Title</label>
            <input value={s.defaultTitle} onChange={(e) => set('defaultTitle', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Default Description</label>
            <textarea rows={2} value={s.defaultDescription} onChange={(e) => set('defaultDescription', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Keywords (comma-separated)</label>
            <input value={s.keywords.join(', ')} onChange={(e) => set('keywords', e.target.value.split(',').map((k) => k.trim()).filter(Boolean))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Twitter Handle</label>
            <input value={s.twitterHandle} onChange={(e) => set('twitterHandle', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Site URL</label>
            <input type="url" value={s.siteUrl} onChange={(e) => set('siteUrl', e.target.value)} className={inputCls} />
          </div>
        </div>
      </section>

      <div className="pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Site Config'}
        </button>
      </div>
    </form>
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-left text-xs text-slate-400 uppercase tracking-wider">
            <th className="pb-3 pr-4">ID</th>
            <th className="pb-3 pr-4">Title</th>
            <th className="pb-3 pr-4">Section</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4 text-center">★</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="py-3 pr-4 font-mono text-slate-500 text-xs">{p.id}</td>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-100">{p.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  {p.shortSubtitle}
                  {(p.featuredMedia.type === 'video' || p.featuredMedia.type === 'iframe') && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.thumbnail ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>
                      {p.thumbnail ? '✓ thumbnail' : '! no thumbnail'}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.section === 'Current Projects' ? 'bg-blue-900/50 text-blue-300' :
                  p.section === 'Archive' ? 'bg-slate-700 text-slate-400' :
                  'bg-slate-700/50 text-slate-300'
                }`}>
                  {p.section ?? 'Most Recent'}
                </span>
              </td>
              <td className="py-3 pr-4 text-slate-400 text-xs">{p.status ?? '—'}</td>
              <td className="py-3 pr-4 text-center">{p.isFeatured && <span className="text-yellow-400">★</span>}</td>
              <td className="py-3 text-right whitespace-nowrap">
                <button onClick={() => onHistory(p)} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded mr-1" title="Version history">
                  ⏱
                </button>
                <button onClick={() => onEdit(p)} className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded mr-2">
                  Edit
                </button>
                <button
                  onClick={() => { if (window.confirm(`Delete "${p.title}"?`)) onDelete(p.id); }}
                  className="text-xs px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-300 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export function Admin() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'projects' | 'site'>('projects');
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold tracking-tight">Admin Panel</span>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${connected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {connected ? 'Server connected' : 'Server offline'}
            </span>
          </div>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to site</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Not connected */}
        {!loading && !connected && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center max-w-xl mx-auto">
            <div className="text-4xl mb-4">🔌</div>
            <h2 className="text-xl font-semibold mb-2">Admin server not running</h2>
            <p className="text-slate-400 text-sm mb-6">The admin panel requires the local server to make changes. Start it in your terminal:</p>
            <div className="bg-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-emerald-400 text-left mb-2">npm run admin</div>
            <p className="text-slate-500 text-xs mt-3">or run both Vite + admin together:</p>
            <div className="bg-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-emerald-400 text-left mt-2">npm run dev:all</div>
            <button onClick={fetchData} className="mt-6 px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-200">Retry connection</button>
          </div>
        )}

        {loading && <div className="text-center py-20 text-slate-500">Connecting to admin server…</div>}

        {/* Connected UI */}
        {!loading && connected && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-slate-800">
              {(['projects', 'site'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  {t === 'projects' ? `Projects (${projects.length})` : 'Site Config'}
                </button>
              ))}
            </div>

            {/* Projects tab */}
            {tab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Projects</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {projects.filter((p) => p.isFeatured).length} featured ·{' '}
                      {projects.filter((p) => p.section === 'Current Projects').length} current ·{' '}
                      {projects.filter((p) => p.section === 'Archive').length} archived
                    </p>
                  </div>
                  <button onClick={openNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded">
                    + New Project
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <ProjectsTable projects={projects} onEdit={openEdit} onDelete={handleDeleteProject} onHistory={setHistoryProject} />
                </div>
              </div>
            )}

            {/* Site Config tab */}
            {tab === 'site' && site && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Site Config</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Basic info, avatar, SEO settings.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <SiteConfigForm initial={site} onSave={handleSaveSite} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}
