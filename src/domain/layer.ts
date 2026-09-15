export const SUPPORTED_LINEWEIGHTS = [
  'Default',
  0.00,
  0.05,
  0.09,
  0.13,
  0.15,
  0.18,
  0.20,
  0.25,
  0.30,
  0.35,
  0.40,
  0.50,
  0.53,
  0.60,
  0.70,
  0.80,
  0.90,
  1.00,
  1.06,
  1.20,
  1.40,
  1.58,
  2.00,
  2.11,
] as const;

export type LineWeight = (typeof SUPPORTED_LINEWEIGHTS)[number];

export interface LayerDefinition {
  id: string;
  name: string;
  color: number; // ACI 1–255
  lineWeight: LineWeight;
  lineType: string;
  plot: boolean;

  // Extensibility fields reserved for future versions
  description?: string;
  transparency?: number; // 0–90
  isFrozen?: boolean;
  isLocked?: boolean;
  plotStyle?: string;
}

export interface LayerConfiguration {
  version: number;
  name: string;
  layers: LayerDefinition[];
}

export function generateLayerId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'layer-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
}

export function createDefaultLayer(name: string = ''): LayerDefinition {
  return {
    id: generateLayerId(),
    name,
    color: 7,
    lineWeight: 0.25,
    lineType: 'Continuous',
    plot: true,
  };
}
