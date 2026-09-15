import type { LayerDefinition } from './layer';
import { isValidAciColor } from '../autocad/colors';
import { isValidLineWeight } from '../autocad/lineweights';
import { isValidLinetype } from '../autocad/linetypes';

export interface LayerValidationError {
  field: 'name' | 'color' | 'lineWeight' | 'lineType' | 'plot';
  message: string;
}

export type LayerValidationMap = Record<string, LayerValidationError[]>;

// AutoCAD forbids characters: < > / \ " : ; ? * | = ,
const INVALID_AUTOCAD_LAYER_CHARS_REGEX = /[<>\\/":;?*|=,]/;

export function validateLayer(layer: LayerDefinition, allLayers: LayerDefinition[]): LayerValidationError[] {
  const errors: LayerValidationError[] = [];
  const trimmedName = layer.name.trim();

  // Name validation
  if (!trimmedName) {
    errors.push({
      field: 'name',
      message: 'Layer name cannot be empty',
    });
  } else {
    if (INVALID_AUTOCAD_LAYER_CHARS_REGEX.test(trimmedName)) {
      errors.push({
        field: 'name',
        message: 'Layer name contains invalid characters: < > / \\ " : ; ? * | = ,',
      });
    }

    // Duplicate detection (case-insensitive, trimmed)
    const lowerName = trimmedName.toLowerCase();
    const isDuplicate = allLayers.some(
      (other) => other.id !== layer.id && other.name.trim().toLowerCase() === lowerName
    );

    if (isDuplicate) {
      errors.push({
        field: 'name',
        message: `Duplicate layer name "${trimmedName}"`,
      });
    }
  }

  // Color validation (ACI 1-255)
  if (!isValidAciColor(layer.color)) {
    errors.push({
      field: 'color',
      message: 'Color must be an ACI number between 1 and 255',
    });
  }

  // Lineweight validation
  if (!isValidLineWeight(layer.lineWeight)) {
    errors.push({
      field: 'lineWeight',
      message: 'Lineweight is not supported by AutoCAD',
    });
  }

  // Linetype validation
  if (!isValidLinetype(layer.lineType)) {
    errors.push({
      field: 'lineType',
      message: 'Linetype is not supported',
    });
  }

  return errors;
}

export function validateAllLayers(layers: LayerDefinition[]): {
  isValid: boolean;
  errors: LayerValidationMap;
  totalErrors: number;
} {
  const errors: LayerValidationMap = {};
  let totalErrors = 0;

  for (const layer of layers) {
    const layerErrors = validateLayer(layer, layers);
    if (layerErrors.length > 0) {
      errors[layer.id] = layerErrors;
      totalErrors += layerErrors.length;
    }
  }

  const isValid = totalErrors === 0 && layers.length > 0;

  return {
    isValid,
    errors,
    totalErrors,
  };
}
