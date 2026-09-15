import { describe, expect, it } from 'vitest';
import { generateLayerScript } from './generateLayerScript';
import type { LayerDefinition } from '../domain/layer';

describe('generateLayerScript', () => {
  it('1. handles one Continuous layer correctly', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'АР_Стены',
        color: 7,
        lineWeight: 0.35,
        lineType: 'Continuous',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);

    // Continuous linetype should NOT trigger _.-LINETYPE loading
    expect(script).not.toContain('_.-LINETYPE');
    // Checks command sequence
    expect(script).toBe(
      [
        '_.-LAYER',
        '_New',
        'АР_Стены',
        '_Color',
        '7',
        'АР_Стены',
        '_LWeight',
        '0.35',
        'АР_Стены',
        '_LType',
        'Continuous',
        'АР_Стены',
        '_Plot',
        '_Plot',
        'АР_Стены',
        '', // blank line to exit _.-LAYER
        '',
      ].join('\n')
    );
  });

  it('2. handles multiple layers', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'Layer1',
        color: 1,
        lineWeight: 0.18,
        lineType: 'Continuous',
        plot: true,
      },
      {
        id: '2',
        name: 'Layer2',
        color: 2,
        lineWeight: 0.25,
        lineType: 'Continuous',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);
    expect(script).toContain('Layer1');
    expect(script).toContain('Layer2');
    expect(script.split('_.-LAYER').length - 1).toBe(2);
  });

  it('3. generates non-Continuous linetype loading section before layers', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'АР_Оси',
        color: 1,
        lineWeight: 0.18,
        lineType: 'CENTER',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);

    // Linetype loading must happen first
    expect(script).toContain('_.-LINETYPE\n_Load\nCENTER\nacad.lin\n');
    expect(script.indexOf('_.-LINETYPE')).toBeLessThan(script.indexOf('_.-LAYER'));
  });

  it('4. loads the same non-Continuous linetype required by multiple layers only once', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'Axis_Grid_1',
        color: 1,
        lineWeight: 0.18,
        lineType: 'CENTER',
        plot: true,
      },
      {
        id: '2',
        name: 'Axis_Grid_2',
        color: 3,
        lineWeight: 0.25,
        lineType: 'CENTER',
        plot: true,
      },
      {
        id: '3',
        name: 'Boundary',
        color: 4,
        lineWeight: 0.30,
        lineType: 'DASHED',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);

    // CENTER should appear exactly once in _.-LINETYPE sections
    const centerLoadCount = (script.match(/_Load\nCENTER\n/g) || []).length;
    expect(centerLoadCount).toBe(1);

    // DASHED should appear exactly once
    const dashedLoadCount = (script.match(/_Load\nDASHED\n/g) || []).length;
    expect(dashedLoadCount).toBe(1);
  });

  it('5. properly handles plot disabled (_NoPlot)', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'Defpoints_Custom',
        color: 8,
        lineWeight: 'Default',
        lineType: 'Continuous',
        plot: false,
      },
    ];

    const script = generateLayerScript(layers);
    expect(script).toContain('_Plot\n_NoPlot\nDefpoints_Custom');
  });

  it('6. correctly formats different lineweights including Default', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'L_Default',
        color: 7,
        lineWeight: 'Default',
        lineType: 'Continuous',
        plot: true,
      },
      {
        id: '2',
        name: 'L_Zero',
        color: 7,
        lineWeight: 0.00,
        lineType: 'Continuous',
        plot: true,
      },
      {
        id: '3',
        name: 'L_Heavy',
        color: 7,
        lineWeight: 2.11,
        lineType: 'Continuous',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);
    expect(script).toContain('_LWeight\nDefault\nL_Default');
    expect(script).toContain('_LWeight\n0.00\nL_Zero');
    expect(script).toContain('_LWeight\n2.11\nL_Heavy');
  });

  it('7. supports Cyrillic characters and preserves exact names', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'АР_Стены_Несущие_Железобетон',
        color: 7,
        lineWeight: 0.50,
        lineType: 'Continuous',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);
    expect(script).toContain('АР_Стены_Несущие_Железобетон');
  });

  it('quotes layer names containing spaces so AutoCAD does not interpret space as Enter', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'A-WALL FULL',
        color: 7,
        lineWeight: 0.35,
        lineType: 'Continuous',
        plot: true,
      },
    ];

    const script = generateLayerScript(layers);
    expect(script).toContain('"A-WALL FULL"');
  });

  it('9. produces deterministic output across multiple invocations', () => {
    const layers: LayerDefinition[] = [
      {
        id: '1',
        name: 'L1',
        color: 1,
        lineWeight: 0.25,
        lineType: 'DASHED',
        plot: true,
      },
      {
        id: '2',
        name: 'L2',
        color: 2,
        lineWeight: 0.35,
        lineType: 'CENTER',
        plot: false,
      },
      {
        id: '3',
        name: 'L3',
        color: 3,
        lineWeight: 'Default',
        lineType: 'PHANTOM',
        plot: true,
      },
    ];

    const run1 = generateLayerScript(layers);
    const run2 = generateLayerScript(layers);
    const run3 = generateLayerScript(layers);

    expect(run1).toEqual(run2);
    expect(run2).toEqual(run3);
  });

  it('returns empty string when no layers are provided', () => {
    expect(generateLayerScript([])).toBe('');
  });

  it('generates complete script for the architectural example preset', () => {
    const exampleLayers: LayerDefinition[] = [
      { id: '1', name: 'АР_Стены', color: 7, lineWeight: 0.35, lineType: 'Continuous', plot: true },
      { id: '2', name: 'АР_Перегородки', color: 4, lineWeight: 0.25, lineType: 'Continuous', plot: true },
      { id: '3', name: 'АР_Оси', color: 1, lineWeight: 0.18, lineType: 'CENTER', plot: true },
      { id: '4', name: 'АР_Мебель', color: 8, lineWeight: 0.13, lineType: 'Continuous', plot: true },
      { id: '5', name: 'АР_Размеры', color: 2, lineWeight: 0.18, lineType: 'Continuous', plot: true },
      { id: '6', name: 'АР_Текст', color: 3, lineWeight: 0.25, lineType: 'Continuous', plot: true },
    ];

    const script = generateLayerScript(exampleLayers);

    // CENTER linetype must be loaded
    expect(script).toContain('_.-LINETYPE\n_Load\nCENTER\nacad.lin\n');

    // All layers must have _New, _Color, _LWeight, _LType, _Plot
    for (const l of exampleLayers) {
      expect(script).toContain(`_New\n${l.name}`);
      expect(script).toContain(`_Color\n${l.color}\n${l.name}`);
      expect(script).toContain(`_LType\n${l.lineType}\n${l.name}`);
      expect(script).toContain(`_Plot\n_Plot\n${l.name}`);
    }

    // Must end with newline
    expect(script.endsWith('\n')).toBe(true);
  });
});

