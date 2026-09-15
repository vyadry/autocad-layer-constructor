import { describe, expect, it } from 'vitest';
import { validateAllLayers, validateLayer } from './validation';
import type { LayerDefinition } from './layer';

describe('validation', () => {
  const baseLayer: LayerDefinition = {
    id: 'l1',
    name: 'АР_Стены',
    color: 7,
    lineWeight: 0.35,
    lineType: 'Continuous',
    plot: true,
  };

  it('validates a correct layer with no errors', () => {
    const errors = validateLayer(baseLayer, [baseLayer]);
    expect(errors).toHaveLength(0);
  });

  it('flags empty layer name or whitespace-only name', () => {
    const emptyLayer: LayerDefinition = { ...baseLayer, name: '   ' };
    const errors = validateLayer(emptyLayer, [emptyLayer]);
    expect(errors.some((e) => e.field === 'name' && e.message.includes('empty'))).toBe(true);
  });

  it('flags invalid AutoCAD characters in layer name', () => {
    const invalidLayer: LayerDefinition = { ...baseLayer, name: 'Layer<Test>' };
    const errors = validateLayer(invalidLayer, [invalidLayer]);
    expect(errors.some((e) => e.field === 'name' && e.message.includes('invalid characters'))).toBe(true);
  });

  it('8. flags duplicate layer names case-insensitively', () => {
    const layer1: LayerDefinition = { ...baseLayer, id: '1', name: 'АР_Стены' };
    const layer2: LayerDefinition = { ...baseLayer, id: '2', name: 'ар_стены' };
    const layer3: LayerDefinition = { ...baseLayer, id: '3', name: ' АР_СТЕНЫ ' };

    const layers = [layer1, layer2, layer3];

    const errors1 = validateLayer(layer1, layers);
    const errors2 = validateLayer(layer2, layers);
    const errors3 = validateLayer(layer3, layers);

    expect(errors1.some((e) => e.message.includes('Duplicate'))).toBe(true);
    expect(errors2.some((e) => e.message.includes('Duplicate'))).toBe(true);
    expect(errors3.some((e) => e.message.includes('Duplicate'))).toBe(true);
  });

  it('flags invalid ACI color (out of 1-255 range or non-integer)', () => {
    const zeroColor: LayerDefinition = { ...baseLayer, color: 0 };
    const bigColor: LayerDefinition = { ...baseLayer, color: 256 };
    const floatColor: LayerDefinition = { ...baseLayer, color: 7.5 };

    expect(validateLayer(zeroColor, [zeroColor]).some((e) => e.field === 'color')).toBe(true);
    expect(validateLayer(bigColor, [bigColor]).some((e) => e.field === 'color')).toBe(true);
    expect(validateLayer(floatColor, [floatColor]).some((e) => e.field === 'color')).toBe(true);
  });

  it('flags unsupported lineweights', () => {
    // @ts-expect-error Testing invalid lineweight runtime input
    const badLw: LayerDefinition = { ...baseLayer, lineWeight: 99.9 };
    expect(validateLayer(badLw, [badLw]).some((e) => e.field === 'lineWeight')).toBe(true);
  });

  it('flags unsupported linetypes', () => {
    const badLt: LayerDefinition = { ...baseLayer, lineType: 'UNKNOWN_LTYPE' };
    expect(validateLayer(badLt, [badLt]).some((e) => e.field === 'lineType')).toBe(true);
  });

  it('validateAllLayers aggregates errors across multiple layers', () => {
    const l1: LayerDefinition = { ...baseLayer, id: '1', name: '' };
    const l2: LayerDefinition = { ...baseLayer, id: '2', color: 999 };
    const l3: LayerDefinition = { ...baseLayer, id: '3', name: 'GoodLayer' };

    const res = validateAllLayers([l1, l2, l3]);
    expect(res.isValid).toBe(false);
    expect(res.totalErrors).toBe(2);
    expect(res.errors['1']).toBeDefined();
    expect(res.errors['2']).toBeDefined();
    expect(res.errors['3']).toBeUndefined();
  });

  it('validateAllLayers marks empty array as invalid', () => {
    const res = validateAllLayers([]);
    expect(res.isValid).toBe(false);
  });
});
