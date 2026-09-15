import { type LineWeight, SUPPORTED_LINEWEIGHTS } from '../domain/layer';

export interface LineWeightOption {
  value: LineWeight;
  label: string;
  scriptValue: string;
}

export function formatLineWeightLabel(lw: LineWeight): string {
  if (lw === 'Default') {
    return 'Default';
  }
  return `${lw.toFixed(2)} mm`;
}

export function formatLineWeightScript(lw: LineWeight): string {
  if (lw === 'Default') {
    return 'Default';
  }
  return lw.toFixed(2);
}

export const LINEWEIGHT_OPTIONS: LineWeightOption[] = SUPPORTED_LINEWEIGHTS.map((lw) => ({
  value: lw,
  label: formatLineWeightLabel(lw),
  scriptValue: formatLineWeightScript(lw),
}));

export function isValidLineWeight(value: unknown): value is LineWeight {
  return SUPPORTED_LINEWEIGHTS.includes(value as LineWeight);
}
