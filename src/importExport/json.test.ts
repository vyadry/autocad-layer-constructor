import { describe, expect, it } from 'vitest';
import { exportConfigurationToJson, importConfigurationFromJson } from './json';
import type { LayerConfiguration } from '../domain/layer';

describe('JSON import / export', () => {
  const sampleConfig: LayerConfiguration = {
    version: 1,
    name: 'АР Standard Test',
    layers: [
      {
        id: 'layer-1',
        name: 'АР_Стены',
        color: 7,
        lineWeight: 0.35,
        lineType: 'Continuous',
        plot: true,
      },
      {
        id: 'layer-2',
        name: 'АР_Оси',
        color: 1,
        lineWeight: 0.18,
        lineType: 'CENTER',
        plot: true,
      },
      {
        id: 'layer-3',
        name: 'АР_Скрытый',
        color: 8,
        lineWeight: 'Default',
        lineType: 'HIDDEN',
        plot: false,
      },
    ],
  };

  it('10. performs successful JSON import/export round trip', () => {
    const exportedJson = exportConfigurationToJson(sampleConfig);
    expect(typeof exportedJson).toBe('string');

    const result = importConfigurationFromJson(exportedJson);
    expect(result.success).toBe(true);
    expect(result.configuration).toBeDefined();

    const imported = result.configuration!;
    expect(imported.name).toBe(sampleConfig.name);
    expect(imported.version).toBe(1);
    expect(imported.layers).toHaveLength(3);

    expect(imported.layers[0].name).toBe('АР_Стены');
    expect(imported.layers[0].color).toBe(7);
    expect(imported.layers[0].lineWeight).toBe(0.35);
    expect(imported.layers[0].lineType).toBe('Continuous');
    expect(imported.layers[0].plot).toBe(true);

    expect(imported.layers[1].name).toBe('АР_Оси');
    expect(imported.layers[1].color).toBe(1);
    expect(imported.layers[1].lineType).toBe('CENTER');

    expect(imported.layers[2].name).toBe('АР_Скрытый');
    expect(imported.layers[2].lineWeight).toBe('Default');
    expect(imported.layers[2].plot).toBe(false);
  });

  it('handles malformed JSON without crashing', () => {
    const malformed = '{ name: "invalid json",,, ';
    const result = importConfigurationFromJson(malformed);
    expect(result.success).toBe(false);
    expect(result.error).toContain('syntax');
  });

  it('rejects JSON when root is not an object', () => {
    const result = importConfigurationFromJson(JSON.stringify(['item1', 'item2']));
    expect(result.success).toBe(false);
    expect(result.error).toContain('object');
  });

  it('rejects JSON when layers is not an array', () => {
    const result = importConfigurationFromJson(JSON.stringify({ name: 'Test', layers: 'not an array' }));
    expect(result.success).toBe(false);
    expect(result.error).toContain('layers');
  });

  it('rejects layer item that lacks a string name', () => {
    const result = importConfigurationFromJson(
      JSON.stringify({
        name: 'Test',
        layers: [{ color: 1 }],
      })
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });
});
