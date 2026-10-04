import {
  HEIGHT_CM,
  KG_PER_FAT_POINT,
  REFERENCE_FAT_PERCENT,
  REFERENCE_WEIGHT_KG,
} from './constants';
import type { Body } from './types';

// The muscle mass stays the one of the reference player; every point of fat
// made by the nutrition adds to the fat mass.
export const getBody = (fat: number): Body => {
  const fatKg =
    (REFERENCE_WEIGHT_KG * REFERENCE_FAT_PERCENT) / 100 +
    fat * KG_PER_FAT_POINT;
  const muscleKg =
    REFERENCE_WEIGHT_KG - (REFERENCE_WEIGHT_KG * REFERENCE_FAT_PERCENT) / 100;
  const weightKg = fatKg + muscleKg;
  const fatPercent = (fatKg / weightKg) * 100;
  return {
    heightCm: HEIGHT_CM,
    weightKg,
    fatPercent,
    musclePercent: 100 - fatPercent,
  };
};
