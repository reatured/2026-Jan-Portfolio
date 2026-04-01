import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3001';

const TOKEN_KEY = 'admin_api_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token: string) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function withAdminAuth(headers: Record<string, string> = {}) {
  const token = getAdminToken();
  if (!token) return headers;
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function genId() {
  return Date.now().toString(36);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Upload helper ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}/api/upload`, {
    method: 'POST',
    body: form,
    headers: withAdminAuth(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json.path as string;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
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

export function UploadBtn({ onUrl, accept = 'image/*', label = 'Upload' }: { onUrl: (url: string) => void; accept?: string; label?: string }) {
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

export function ImageUploadBtn({ onUrl }: { onUrl: (url: string) => void }) {
  return <UploadBtn onUrl={onUrl} accept="image/*" />;
}

// ── Tag Input ─────────────────────────────────────────────────────────────────

export function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
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
