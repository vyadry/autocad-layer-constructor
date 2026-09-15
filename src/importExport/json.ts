import {
  createDefaultLayer,
  generateLayerId,
  type LayerConfiguration,
  type LayerDefinition,
  type LineWeight,
  SUPPORTED_LINEWEIGHTS,
} from '../domain/layer';

export interface ImportResult {
  success: boolean;
  configuration?: LayerConfiguration;
  error?: string;
}

export function exportConfigurationToJson(config: LayerConfiguration): string {
  const exportData = {
    version: config.version || 1,
    name: config.name || 'AutoCAD Layers',
    layers: config.layers.map((layer) => ({
      name: layer.name,
      color: layer.color,
      lineWeight: layer.lineWeight,
      lineType: layer.lineType,
      plot: layer.plot,
      ...(layer.description ? { description: layer.description } : {}),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export function importConfigurationFromJson(rawJson: string): ImportResult {
  if (!rawJson || typeof rawJson !== 'string') {
    return { success: false, error: 'Input is empty or invalid' };
  }

  let data: unknown;
  try {
    data = JSON.parse(rawJson);
  } catch {
    return { success: false, error: 'Invalid JSON format: please check file syntax' };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, error: 'Root JSON element must be an object' };
  }

  const record = data as Record<string, unknown>;

  const configName =
    typeof record.name === 'string' && record.name.trim().length > 0
      ? record.name.trim()
      : 'Imported Configuration';

  const version = typeof record.version === 'number' ? record.version : 1;

  if (!Array.isArray(record.layers)) {
    return { success: false, error: 'Field "layers" must be an array of layer definitions' };
  }

  const layers: LayerDefinition[] = [];

  for (let i = 0; i < record.layers.length; i++) {
    const item = record.layers[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Layer at index ${i} is not a valid object` };
    }

    const layerRecord = item as Record<string, unknown>;

    if (typeof layerRecord.name !== 'string') {
      return { success: false, error: `Layer at index ${i} is missing a string "name"` };
    }

    const color = typeof layerRecord.color === 'number' ? layerRecord.color : 7;
    const lineType = typeof layerRecord.lineType === 'string' ? layerRecord.lineType : 'Continuous';
    const plot = typeof layerRecord.plot === 'boolean' ? layerRecord.plot : true;

    // Check lineweight
    let lineWeight: LineWeight = 0.25;
    if (SUPPORTED_LINEWEIGHTS.includes(layerRecord.lineWeight as LineWeight)) {
      lineWeight = layerRecord.lineWeight as LineWeight;
    } else if (layerRecord.lineWeight === 'Default') {
      lineWeight = 'Default';
    }

    layers.push({
      id: generateLayerId(),
      name: layerRecord.name,
      color,
      lineWeight,
      lineType,
      plot,
      description: typeof layerRecord.description === 'string' ? layerRecord.description : undefined,
    });
  }

  if (layers.length === 0) {
    // If imported array was empty, provide one default layer
    layers.push(createDefaultLayer());
  }

  return {
    success: true,
    configuration: {
      version,
      name: configName,
      layers,
    },
  };
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
