import { describe, expect, test } from 'vitest';

import { gaugeAngle } from './gauge';

describe('gaugeAngle', () => {
  test('minimum points hard left', () => expect(gaugeAngle(2000, 2000, 10000)).toBe(-90));
  test('maximum points hard right', () => expect(gaugeAngle(10000, 2000, 10000)).toBe(90));
  test('midpoint points straight up', () => expect(gaugeAngle(6000, 2000, 10000)).toBe(0));
  test('clamps above range', () => expect(gaugeAngle(99999, 2000, 10000)).toBe(90));
  test('clamps below range', () => expect(gaugeAngle(-5, 0, 100)).toBe(-90));
  test('NaN rests at the minimum', () => expect(gaugeAngle(Number.NaN, 2000, 10000)).toBe(-90));
});
