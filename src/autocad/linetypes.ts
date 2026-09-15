export const SUPPORTED_LINETYPES = [
  'Continuous',
  'CENTER',
  'CENTER2',
  'CENTERX2',
  'DASHED',
  'DASHED2',
  'DASHEDX2',
  'HIDDEN',
  'HIDDEN2',
  'HIDDENX2',
  'PHANTOM',
  'PHANTOM2',
  'PHANTOMX2',
  'DOT',
  'DOT2',
  'DOTX2',
] as const;

export type SupportedLinetype = (typeof SUPPORTED_LINETYPES)[number];

export interface LinetypeInfo {
  name: SupportedLinetype;
  description: string;
  strokeDasharray: string;
  isContinuous: boolean;
}

export const LINETYPES_CATALOG: LinetypeInfo[] = [
  { name: 'Continuous', description: 'Solid continuous line', strokeDasharray: 'none', isContinuous: true },
  { name: 'CENTER', description: 'Center line (long dash, short dash)', strokeDasharray: '12, 3, 3, 3', isContinuous: false },
  { name: 'CENTER2', description: 'Center line (half scale)', strokeDasharray: '6, 2, 2, 2', isContinuous: false },
  { name: 'CENTERX2', description: 'Center line (double scale)', strokeDasharray: '24, 6, 6, 6', isContinuous: false },
  { name: 'DASHED', description: 'Standard dashed line', strokeDasharray: '8, 4', isContinuous: false },
  { name: 'DASHED2', description: 'Dashed line (half scale)', strokeDasharray: '4, 2', isContinuous: false },
  { name: 'DASHEDX2', description: 'Dashed line (double scale)', strokeDasharray: '16, 8', isContinuous: false },
  { name: 'HIDDEN', description: 'Hidden / unseen edges', strokeDasharray: '5, 3', isContinuous: false },
  { name: 'HIDDEN2', description: 'Hidden line (half scale)', strokeDasharray: '2.5, 1.5', isContinuous: false },
  { name: 'HIDDENX2', description: 'Hidden line (double scale)', strokeDasharray: '10, 6', isContinuous: false },
  { name: 'PHANTOM', description: 'Phantom line (long dash, two short dashes)', strokeDasharray: '14, 3, 3, 3, 3, 3', isContinuous: false },
  { name: 'PHANTOM2', description: 'Phantom line (half scale)', strokeDasharray: '7, 1.5, 1.5, 1.5, 1.5, 1.5', isContinuous: false },
  { name: 'PHANTOMX2', description: 'Phantom line (double scale)', strokeDasharray: '28, 6, 6, 6, 6, 6', isContinuous: false },
  { name: 'DOT', description: 'Dotted line', strokeDasharray: '2, 4', isContinuous: false },
  { name: 'DOT2', description: 'Dotted line (half scale)', strokeDasharray: '1, 2', isContinuous: false },
  { name: 'DOTX2', description: 'Dotted line (double scale)', strokeDasharray: '4, 8', isContinuous: false },
];

export function isValidLinetype(type: string): boolean {
  return SUPPORTED_LINETYPES.some((lt) => lt.toLowerCase() === type.trim().toLowerCase());
}

export function normalizeLinetype(type: string): SupportedLinetype | undefined {
  return SUPPORTED_LINETYPES.find((lt) => lt.toLowerCase() === type.trim().toLowerCase());
}

export function isNonContinuousLinetype(type: string): boolean {
  const norm = normalizeLinetype(type);
  return norm !== undefined && norm !== 'Continuous';
}
