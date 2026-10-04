import { expect, test } from 'vitest';

import {
  HEIGHT_CM,
  KG_PER_FAT_POINT,
  REFERENCE_FAT_PERCENT,
  REFERENCE_WEIGHT_KG,
} from './constants';
import { getBody } from './body';

test('without any fat made, the player is the reference one', () => {
  const body = getBody(0);
  expect(body.heightCm).toBe(HEIGHT_CM);
  expect(body.weightKg).toBeCloseTo(REFERENCE_WEIGHT_KG, 5);
  expect(body.fatPercent).toBeCloseTo(REFERENCE_FAT_PERCENT, 5);
});

test('fat and muscle always add up to 100%', () => {
  for (const fat of [0, 1, 25.5, 400]) {
    const { fatPercent, musclePercent } = getBody(fat);
    expect(fatPercent + musclePercent).toBeCloseTo(100, 5);
  }
});

test('fat makes the player heavier and less muscular', () => {
  const lean = getBody(0);
  const heavy = getBody(100);
  expect(heavy.weightKg).toBeCloseTo(
    REFERENCE_WEIGHT_KG + 100 * KG_PER_FAT_POINT,
    5,
  );
  expect(heavy.fatPercent).toBeGreaterThan(lean.fatPercent);
  expect(heavy.musclePercent).toBeLessThan(lean.musclePercent);
});
