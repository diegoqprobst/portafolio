import { expect, test } from 'vitest';

import { contrastRatio, fromHex } from './color';
import { TOKENS } from './tokens';

const t = Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [k, fromHex(v)])) as Record<keyof typeof TOKENS, ReturnType<typeof fromHex>>;

test('drafting ink on the navy ground meets 4.5:1', () => expect(contrastRatio(t.ink, t.navy)).toBeGreaterThanOrEqual(4.5));
test('drafting ink on panels meets 4.5:1', () => expect(contrastRatio(t.ink, t.panel)).toBeGreaterThanOrEqual(4.5));
test('drafting ink on the bar chrome meets 4.5:1', () => expect(contrastRatio(t.ink, t.chrome)).toBeGreaterThanOrEqual(4.5));
test('soft ink (secondary text) on panels meets 4.5:1', () => expect(contrastRatio(t.inkSoft, t.panel)).toBeGreaterThanOrEqual(4.5));
test('cyan labels on panels meet 4.5:1', () => expect(contrastRatio(t.cyan, t.panel)).toBeGreaterThanOrEqual(4.5));
test('orange marks on the bar chrome meet 3:1', () => expect(contrastRatio(t.orange, t.chrome)).toBeGreaterThanOrEqual(3));
test('orange marks on panels meet 3:1', () => expect(contrastRatio(t.orange, t.panel)).toBeGreaterThanOrEqual(3));
test('the live accent stays the CTO orange', () => expect(TOKENS.orange).toBe('#F59A4A'));
