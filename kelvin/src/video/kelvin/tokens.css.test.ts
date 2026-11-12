import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import { TOKENS } from './lib/tokens';

const css = readFileSync(fileURLToPath(new URL('./kelvin.css', import.meta.url)), 'utf8');

test.each(Object.entries(TOKENS).map(([k, v]) => [k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), v]))('kelvin.css defines --kv-%s as the tested value', (name, value) => {
  expect(css).toMatch(new RegExp(`--kv-${name}:\\s*${value}\\b`, 'i'));
});

test('kelvin.css is not wrapped in a cascade layer, so it beats the scaffold and host page resets', () => {
  expect(css).not.toMatch(/@layer\s/);
});
