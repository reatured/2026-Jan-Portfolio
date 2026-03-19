import React, { useState } from 'react';
import type { SiteConfig, Role, NavLink as NavLinkType } from '../../types';
import { ImageUploadBtn } from './shared';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const SOCIAL_ICON_OPTIONS = [
  { label: 'GitHub', value: 'GitHub' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Email / Mail', value: 'Email' },
  { label: 'Link (generic)', value: 'Link' },
];

// ── Nav Links Editor ──────────────────────────────────────────────────────────

function NavLinksEditor({
  links,
  onChange,
}: {
  links: NavLinkType[];
  onChange: (links: NavLinkType[]) => void;
}) {
  function updateLink(i: number, key: keyof NavLinkType, val: string) {
    const next = [...links];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }

  function addLink() {
    onChange([...links, { label: '', href: '' }]);
  }

  function removeLink(i: number) {
    onChange(links.filter((_, idx) => idx !== i));
  }

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
        Navigation Links
      </Typography>
      <Stack spacing={1.5}>
        {links.map((link, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              fullWidth
              label="Label"
              value={link.label}
              onChange={(e) => updateLink(i, 'label', e.target.value)}
              placeholder="e.g. Home"
            />
            <TextField
              size="small"
              fullWidth
              label="Href"
              value={link.href}
              onChange={(e) => updateLink(i, 'href', e.target.value)}
              placeholder="/ or /#projects"
            />
            <IconButton size="small" color="error" onClick={() => removeLink(i)}>
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
          Add Nav Link
        </Button>
      </Stack>
    </Box>
  );
}

// ── Roles Editor ──────────────────────────────────────────────────────────────

function RolesEditor({
  roles,
  onChange,
}: {
  roles: Role[];
  onChange: (roles: Role[]) => void;
}) {
  function updateRole(i: number, updates: Partial<Role>) {
    const next = [...roles];
    next[i] = { ...next[i], ...updates };
    onChange(next);
  }

  function addRole() {
    onChange([...roles, { title: '', details: [''] }]);
  }

  function removeRole(i: number) {
    onChange(roles.filter((_, idx) => idx !== i));
  }

  function addDetail(roleIdx: number) {
    const next = [...roles];
    next[roleIdx] = { ...next[roleIdx], details: [...next[roleIdx].details, ''] };
    onChange(next);
  }

  function updateDetail(roleIdx: number, detailIdx: number, val: string) {
    const next = [...roles];
    const details = [...next[roleIdx].details];
    details[detailIdx] = val;
    next[roleIdx] = { ...next[roleIdx], details };
    onChange(next);
  }

  function removeDetail(roleIdx: number, detailIdx: number) {
    const next = [...roles];
    next[roleIdx] = {
      ...next[roleIdx],
      details: next[roleIdx].details.filter((_, idx) => idx !== detailIdx),
    };
    onChange(next);
  }

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', display: 'block', mb: 2 }}>
        Roles
      </Typography>
      <Stack spacing={2}>
        {roles.map((role, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                label="Role Title"
                value={role.title}
                onChange={(e) => updateRole(i, { title: e.target.value })}
                placeholder="e.g. Full Stack Engineer"
              />
              <IconButton size="small" color="error" onClick={() => removeRole(i)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Details
            </Typography>
            <Stack spacing={1}>
              {role.details.map((detail, j) => (
                <Box key={j} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={detail}
                    onChange={(e) => updateDetail(i, j, e.target.value)}
                    placeholder="Detail description"
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeDetail(i, j)}
                    disabled={role.details.length <= 1}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
              <Button
                size="small"
                onClick={() => addDetail(i)}
                sx={{ alignSelf: 'flex-start', color: 'primary.main', fontSize: '0.7rem' }}
              >
                + Add Detail
              </Button>
            </Stack>
          </Paper>
        ))}
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={addRole}
          sx={{ alignSelf: 'flex-start', color: 'primary.main' }}
        >
          Add Role
        </Button>
      </Stack>
    </Box>
  );
}

// ── Site Config Form ──────────────────────────────────────────────────────────

export function SiteConfigForm({ initial, onSave }: { initial: SiteConfig; onSave: (s: SiteConfig) => Promise<void> }) {
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

        {/* Nav Links */}
        <NavLinksEditor
          links={s.navLinks}
          onChange={(links) => set('navLinks', links)}
        />

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

        {/* Roles */}
        <RolesEditor
          roles={s.roles}
          onChange={(roles) => set('roles', roles)}
        />

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
