import React, { useState, useEffect } from 'react';
import type { Project } from '@types';
import { formatDate } from './shared';
import { useProjectHistory } from '../../../infrastructure/api/hooks';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

interface HistoryEntry {
  savedAt: string;
  snapshot: Project;
}

export const HistoryModal: React.FC<{
  projectId: string;
  onRestore: (savedAt: string) => Promise<void>;
  onClose: () => void;
}> = ({ projectId, onRestore, onClose }) => {
  const { data: entries = [], isLoading, error } = useProjectHistory(projectId);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && entries.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 0.5 }}>No version history yet.</Typography>
            <Typography variant="caption" color="text.disabled">
              History is saved automatically each time you save a project.
            </Typography>
          </Box>
        )}

        {!isLoading && entries.length > 0 && (
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
