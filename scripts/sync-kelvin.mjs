// Copies the Kelvin skin (kelvin/src) into components/kelvin so the Next.js site can use it.
// Edit the skin in kelvin/src, then run: npm run sync:kelvin
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'kelvin', 'src');
const to = join(root, 'components', 'kelvin');
const HEADER = '// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.\n';

rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const source = join(dir, name);
    const target = join(to, relative(from, source));
    if (statSync(source).isDirectory()) {
      mkdirSync(target, { recursive: true });
      walk(source);
      continue;
    }
    if (/\.test\.tsx?$/.test(name)) continue;
    if (!/\.(tsx?|css)$/.test(name)) {
      cpSync(source, target);
      continue;
    }
    let text = readFileSync(source, 'utf8');
    if (/\.tsx?$/.test(name)) {
      // The skin's `@/` means its own src/; the site's `@/` means the repo root.
      text = text.replace(/from '@\/([^']+)'/g, (_, path) => {
        let rel = relative(dirname(target), join(to, path)).split('\\').join('/');
        if (!rel.startsWith('.')) rel = `./${rel}`;
        return `from '${rel}'`;
      });
      // Keep 'use client' / jsx pragmas first.
      const lead = text.match(/^(\s*(\/\*\*[^]*?\*\/|'use client';)\s*)*/)?.[0] ?? '';
      text = lead + HEADER + text.slice(lead.length);
    } else {
      // The site runs Tailwind v3, which claims the layer names base/components/utilities.
      // Rename the skin's layers consistently so their order and meaning are unchanged.
      text = text.replace(/@layer\s+([^{;]+)([{;])/g, (_, names, end) => {
        const renamed = names.replace(/(^|[\s,])(base|components|utilities)\b/g, '$1kv-$2');
        return `@layer ${renamed.trim()} ${end}`;
      });
      text = `/* Generated from kelvin/src — edit there, then npm run sync:kelvin. */\n${text}`;
    }
    writeFileSync(target, text);
  }
}

walk(from);
console.log(`Synced ${relative(root, from)} → ${relative(root, to)}`);
