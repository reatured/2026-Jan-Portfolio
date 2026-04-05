import React, { useState, useRef, useCallback } from 'react';
import type { Project } from '../../../features/common/types';
import { API } from './shared';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// ── Projects Table with Search, Filter & Drag-to-Reorder ─────────────────────

export function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onHistory,
  onReorder,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onHistory: (p: Project) => void;
  onReorder: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drag state
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Collect unique statuses for filter
  const statuses = Array.from(new Set(projects.map((p) => p.status ?? '').filter(Boolean)));

  // Filter & search
  const filtered = projects
    .filter((p) => {
      if (sectionFilter !== 'all' && (p.section ?? 'Most Recent') !== sectionFilter) return false;
      if (statusFilter !== 'all' && (p.status ?? '') !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortSubtitle.toLowerCase().includes(q) ||
          p.id.includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const isFiltered = search || sectionFilter !== 'all' || statusFilter !== 'all';

  // Drag handlers (only when not filtered, so reorder makes sense)
  const handleDragStart = useCallback((i: number) => {
    dragIdx.current = i;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIdx(i);
  }, []);

  const handleDrop = useCallback((i: number) => {
    const from = dragIdx.current;
    if (from === null || from === i) {
      setDragOverIdx(null);
      dragIdx.current = null;
      return;
    }
    // Reorder in-place
    const ids = projects.map((p) => p.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(i, 0, moved);
    onReorder(ids);
    setDragOverIdx(null);
    dragIdx.current = null;
  }, [projects, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragOverIdx(null);
    dragIdx.current = null;
  }, []);

  return (
    <Box>
      {/* Search & Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Section</InputLabel>
          <Select
            label="Section"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <MenuItem value="all">All Sections</MenuItem>
            <MenuItem value="Current Projects">Current Projects</MenuItem>
            <MenuItem value="Most Recent">Most Recent</MenuItem>
            <MenuItem value="Archive">Archive</MenuItem>
          </Select>
        </FormControl>
        {statuses.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isFiltered && (
          <Chip
            label={`${filtered.length} of ${projects.length}`}
            size="small"
            variant="outlined"
            sx={{ height: 24, fontSize: '0.7rem' }}
          />
        )}
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {!isFiltered && (
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', width: 32 }}></TableCell>
              )}
              <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ID</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Section</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p, i) => {
              // Find the real index in projects array for drag
              const realIdx = projects.findIndex((proj) => proj.id === p.id);
              return (
                <TableRow
                  key={p.id}
                  hover
                  draggable={!isFiltered}
                  onDragStart={() => handleDragStart(realIdx)}
                  onDragOver={(e) => handleDragOver(e, realIdx)}
                  onDrop={() => handleDrop(realIdx)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    cursor: !isFiltered ? 'grab' : undefined,
                    ...(dragOverIdx === realIdx && {
                      borderTop: '2px solid',
                      borderColor: 'primary.main',
                    }),
                  }}
                >
                  {!isFiltered && (
                    <TableCell sx={{ width: 32, px: 0.5 }}>
                      <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'grab' }} />
                    </TableCell>
                  )}
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
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={isFiltered ? 6 : 7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {search ? `No projects match "${search}"` : 'No projects found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
