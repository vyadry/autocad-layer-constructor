// AutoCAD Color Index (ACI) 1–255 mapping and preview utilities

export interface AciColorInfo {
  index: number;
  name?: string;
  hex: string;
}

export const STANDARD_ACI_COLORS: AciColorInfo[] = [
  { index: 1, name: 'Red', hex: '#FF0000' },
  { index: 2, name: 'Yellow', hex: '#FFFF00' },
  { index: 3, name: 'Green', hex: '#00FF00' },
  { index: 4, name: 'Cyan', hex: '#00FFFF' },
  { index: 5, name: 'Blue', hex: '#0000FF' },
  { index: 6, name: 'Magenta', hex: '#FF00FF' },
  { index: 7, name: 'White / Black', hex: '#FFFFFF' },
  { index: 8, name: 'Dark Gray', hex: '#808080' },
  { index: 9, name: 'Light Gray', hex: '#C0C0C0' },
];

// Helper to compute standard AutoCAD ACI 1-255 colors to hex RGB
function buildAciColorMap(): Record<number, string> {
  const map: Record<number, string> = {
    1: '#FF0000',
    2: '#FFFF00',
    3: '#00FF00',
    4: '#00FFFF',
    5: '#0000FF',
    6: '#FF00FF',
    7: '#FFFFFF',
    8: '#808080',
    9: '#C0C0C0',
  };

  // Standard grayscale values 250–255
  const grays = ['#333333', '#505050', '#696969', '#828282', '#BEBEBE', '#FFFFFF'];
  for (let i = 0; i < grays.length; i++) {
    map[250 + i] = grays[i];
  }

  // AutoCAD hue wheel for 10–249 (24 hues, 5 saturation/lightness variations per hue)
  // Hue steps: 10, 20, 30, ... 240
  const baseHues = [
    [255, 0, 0],       // 10 Red
    [255, 63, 0],      // 20 Red-Orange
    [255, 127, 0],     // 30 Orange
    [255, 191, 0],     // 40 Yellow-Orange
    [255, 255, 0],     // 50 Yellow
    [191, 255, 0],     // 60 Yellow-Green
    [127, 255, 0],     // 70 Green-Yellow
    [63, 255, 0],      // 80
    [0, 255, 0],       // 90 Green
    [0, 255, 63],      // 100
    [0, 255, 127],     // 110
    [0, 255, 191],     // 120
    [0, 255, 255],     // 130 Cyan
    [0, 191, 255],     // 140
    [0, 127, 255],     // 150
    [0, 63, 255],      // 160
    [0, 0, 255],       // 170 Blue
    [63, 0, 255],      // 180
    [127, 0, 255],     // 190
    [191, 0, 255],     // 200
    [255, 0, 255],     // 210 Magenta
    [255, 0, 191],     // 220
    [255, 0, 127],     // 230
    [255, 0, 63],      // 240
  ];

  // Each hue has variants 0 (+0), 2 (+2), 4 (+4), 6 (+6), 8 (+8)
  // 0: full saturation, 100% luminance
  // 2: 80% luminance
  // 4: 60% luminance
  // 6: 50% luminance
  // 8: 30% luminance
  // Odd numbers are tinted towards white (50% pastel)
  const luminanceFactors = [1.0, 1.0, 0.8, 0.8, 0.6, 0.6, 0.45, 0.45, 0.3, 0.3];

  for (let h = 0; h < 24; h++) {
    const baseColor = baseHues[h];
    for (let offset = 0; offset < 10; offset++) {
      const aci = 10 + h * 10 + offset;
      if (aci > 249) break;

      const factor = luminanceFactors[offset];
      const isPastel = offset % 2 === 1;

      let r = Math.round(baseColor[0] * factor);
      let g = Math.round(baseColor[1] * factor);
      let b = Math.round(baseColor[2] * factor);

      if (isPastel) {
        // Blend 50% with white
        r = Math.round(r * 0.5 + 255 * 0.5);
        g = Math.round(g * 0.5 + 255 * 0.5);
        b = Math.round(b * 0.5 + 255 * 0.5);
      }

      const hex = '#' + [r, g, b].map((c) => Math.min(255, Math.max(0, c)).toString(16).padStart(2, '0')).join('');
      map[aci] = hex.toUpperCase();
    }
  }

  return map;
}

export const ACI_COLOR_MAP: Record<number, string> = buildAciColorMap();

export function isValidAciColor(color: number): boolean {
  return Number.isInteger(color) && color >= 1 && color <= 255;
}

export function getAciHex(color: number): string {
  return ACI_COLOR_MAP[color] || '#FFFFFF';
}

export function getAciName(color: number): string | undefined {
  const std = STANDARD_ACI_COLORS.find((c) => c.index === color);
  return std?.name;
}
