import { createDefaultLayer, generateLayerId, type LayerConfiguration, type LayerDefinition } from './layer';

export const EXAMPLE_PRESET_LAYERS: Omit<LayerDefinition, 'id'>[] = [
  {
    name: 'АР_Стены',
    color: 7, // White/Black
    lineWeight: 0.35,
    lineType: 'Continuous',
    plot: true,
  },
  {
    name: 'АР_Перегородки',
    color: 4, // Cyan
    lineWeight: 0.25,
    lineType: 'Continuous',
    plot: true,
  },
  {
    name: 'АР_Оси',
    color: 1, // Red
    lineWeight: 0.18,
    lineType: 'CENTER',
    plot: true,
  },
  {
    name: 'АР_Мебель',
    color: 8, // Dark Gray
    lineWeight: 0.13,
    lineType: 'Continuous',
    plot: true,
  },
  {
    name: 'АР_Размеры',
    color: 2, // Yellow
    lineWeight: 0.18,
    lineType: 'Continuous',
    plot: true,
  },
  {
    name: 'АР_Текст',
    color: 3, // Green
    lineWeight: 0.25,
    lineType: 'Continuous',
    plot: true,
  },
];

export function getExampleConfiguration(): LayerConfiguration {
  return {
    version: 1,
    name: 'АР Example Preset',
    layers: EXAMPLE_PRESET_LAYERS.map((layer) => ({
      ...layer,
      id: generateLayerId(),
    })),
  };
}

export function getNewConfiguration(): LayerConfiguration {
  return {
    version: 1,
    name: 'New Standard',
    layers: [createDefaultLayer('АР_Стены')],
  };
}
