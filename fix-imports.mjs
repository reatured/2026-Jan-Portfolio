import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

const filesToFix = [];

// Find all TSX/TS files
function findFiles(dir, baseDir = dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findFiles(fullPath, baseDir);
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      filesToFix.push(fullPath);
    }
  }
}

findFiles('src');

// Fix imports
for (const filePath of filesToFix) {
  let content = readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix various import patterns based on file location
  const replacements = [
    { from: /from ['"]\.\.\/lib\/seo['"]/, to: 'from \'../../infrastructure/lib/seo\'' },
    { from: /from ['"]\.\.\/\.\.\/config\/projects['"]/, to: 'from \'../../../config/projects\'' },
    { from: /from ['"]\.\.\/\.\.\/config\/site['"]/, to: 'from \'../../../config/site\'' },
    { from: /from ['"]\.\.\/config\/site['"]/, to: 'from \'../../../../config/site\'' },
    { from: /from ['"]\.\.\/components\/project\//, to: 'from \'../../features/projects/components/\'' },
    { from: /from ['"]\.\.\/components\/layout\//, to: 'from \'../../features/common/layout/\'' },
    { from: /from ['"]\.\.\/components\/ui\//, to: 'from \'../../features/common/ui/\'' },
    { from: /from ['"]\.\.\/hooks\//, to: 'from \'../../features/common/hooks/\'' },
    { from: /from ['"]\.\.\/theme['"]/, to: 'from \'../app/theme\'' },
    { from: /from ['"]\.\.\/\.\.\/theme['"]/, to: 'from \'../../../app/theme\'' },
    { from: /from ['"]\.\.\/types['"]/, to: 'from \'../features/common/types\'' },
    { from: /from ['"]\.\.\/\.\.\/types['"]/, to: 'from \'../../../features/common/types\'' },
  ];
  
  for (const { from, to } of replacements) {
    if (content.match(from)) {
      content = content.replace(from, to);
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

console.log('Import fixing complete!');
