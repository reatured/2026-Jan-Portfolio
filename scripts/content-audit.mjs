import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'config', 'data.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);

const problems = [];
const projectIds = new Set();

for (const p of data.projects || []) {
  if (projectIds.has(p.id)) problems.push(`[${p.id}] duplicate id`);
  projectIds.add(p.id);

  if (!p.year || !String(p.year).trim()) problems.push(`[${p.id}] missing year`);
  if (!p.status || !String(p.status).trim()) problems.push(`[${p.id}] missing status`);
  if (!p.shortSubtitle || p.shortSubtitle.length < 40) problems.push(`[${p.id}] shortSubtitle is too short (<40 chars)`);
  if (!p.summary || p.summary.length < 120) problems.push(`[${p.id}] summary is too short (<120 chars)`);
  if (!p.content || p.content.length < 600) problems.push(`[${p.id}] content is too short (<600 chars)`);
  if (!Array.isArray(p.links)) problems.push(`[${p.id}] links is not an array`);

  if (Array.isArray(p.links)) {
    for (const link of p.links) {
      if (!/^https?:\/\//.test(link.url || '')) {
        problems.push(`[${p.id}] non-http(s) link: ${link.url}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`Content audit failed with ${problems.length} issue(s):`);
  for (const issue of problems) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Content audit passed: ${data.projects.length} projects checked.`);
