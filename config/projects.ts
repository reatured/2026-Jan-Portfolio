import type { Project } from '../types';
import dataJson from './data.json';
import richContentJson from './richContent.json';

const richContent = richContentJson as Record<string, string>;

// Admin-saved content in data.json takes priority if non-empty.
export const projects: Project[] = (dataJson.projects as unknown as Project[]).map((p) => ({
  ...p,
  content: p.content || richContent[p.id] || undefined,
}));
