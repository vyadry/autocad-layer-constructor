import type { LayerDefinition } from '../domain/layer';
import { formatLineWeightScript } from './lineweights';
import { isNonContinuousLinetype, normalizeLinetype } from './linetypes';

export interface GenerateScriptOptions {
  linetypeFile?: string; // default: 'acad.lin'
}

/**
 * Quotes a layer name if it contains spaces or special characters,
 * ensuring AutoCAD's command interpreter doesn't treat space as Enter.
 */
export function formatLayerNameToken(name: string): string {
  const trimmed = name.trim();
  if (trimmed.includes(' ')) {
    return `"${trimmed}"`;
  }
  return trimmed;
}

/**
 * Pure function to generate an AutoCAD .scr script that creates/updates layers
 * with specified colors, lineweights, linetypes, and plot settings.
 */
export function generateLayerScript(
  layers: LayerDefinition[],
  options: GenerateScriptOptions = {}
): string {
  if (layers.length === 0) {
    return '';
  }

  const linetypeFile = options.linetypeFile || 'acad.lin';
  const lines: string[] = [];

  // 1. Identify and deduplicate all required non-Continuous linetypes
  const requiredLinetypesSet = new Set<string>();
  for (const layer of layers) {
    if (isNonContinuousLinetype(layer.lineType)) {
      const normalized = normalizeLinetype(layer.lineType);
      if (normalized) {
        requiredLinetypesSet.add(normalized);
      }
    }
  }

  // Sort alphabetically for deterministic script output
  const requiredLinetypes = Array.from(requiredLinetypesSet).sort();

  // 2. Generate linetype loading section
  for (const lt of requiredLinetypes) {
    lines.push('_.-LINETYPE');
    lines.push('_Load');
    lines.push(lt);
    lines.push(linetypeFile);
    lines.push(''); // Empty line (Enter) to exit _.-LINETYPE prompt
  }

  // 3. Generate layer creation and property assignment section
  for (const layer of layers) {
    const layerToken = formatLayerNameToken(layer.name);
    const lwToken = formatLineWeightScript(layer.lineWeight);
    const ltToken = normalizeLinetype(layer.lineType) || layer.lineType.trim();
    const plotToken = layer.plot ? '_Plot' : '_NoPlot';

    lines.push('_.-LAYER');
    // _New safely creates the layer if it doesn't exist; if it exists, AutoCAD continues
    lines.push('_New');
    lines.push(layerToken);

    // Explicitly set properties on the layer so existing layers are also updated
    lines.push('_Color');
    lines.push(String(layer.color));
    lines.push(layerToken);

    lines.push('_LWeight');
    lines.push(lwToken);
    lines.push(layerToken);

    lines.push('_LType');
    lines.push(ltToken);
    lines.push(layerToken);

    lines.push('_Plot');
    lines.push(plotToken);
    lines.push(layerToken);

    // Empty line to exit _.-LAYER command
    lines.push('');
  }

  // AutoCAD scripts require a trailing newline
  return lines.join('\n') + '\n';
}
