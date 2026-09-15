import React from 'react';
import type { LayerDefinition } from '../domain/layer';
import type { LayerValidationMap } from '../domain/validation';
import { LayerRow } from './LayerRow';
import { Plus, Layers } from 'lucide-react';

interface LayerTableProps {
  layers: LayerDefinition[];
  validationErrors: LayerValidationMap;
  onUpdateLayer: (index: number, updated: LayerDefinition) => void;
  onAddLayer: () => void;
  onDuplicateLayer: (index: number) => void;
  onDeleteLayer: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const LayerTable: React.FC<LayerTableProps> = ({
  layers,
  validationErrors,
  onUpdateLayer,
  onAddLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="bg-[#141722] border border-[#242938] rounded-lg shadow-xl overflow-hidden flex flex-col">
      {/* Table header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242938] bg-[#191d2b]">
        <div className="flex items-center space-x-2">
          <Layers size={16} className="text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Layer Definitions ({layers.length})
          </span>
        </div>
        <button
          type="button"
          onClick={onAddLayer}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow-xs"
        >
          <Plus size={14} />
          <span>Add layer</span>
        </button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#10131c] border-b border-[#242938] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-3 py-2.5 text-center w-14">#</th>
              <th className="px-3 py-2.5">Layer Name</th>
              <th className="px-3 py-2.5 w-36">Color (ACI)</th>
              <th className="px-3 py-2.5 w-40">Lineweight</th>
              <th className="px-3 py-2.5 w-48">Linetype</th>
              <th className="px-3 py-2.5 text-center w-24">Plot</th>
              <th className="px-3 py-2.5 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2130]">
            {layers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                  <p className="mb-2">No layers defined.</p>
                  <button
                    type="button"
                    onClick={onAddLayer}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-xs hover:bg-blue-600/30 transition-colors"
                  >
                    + Add your first layer
                  </button>
                </td>
              </tr>
            ) : (
              layers.map((layer, idx) => (
                <LayerRow
                  key={layer.id}
                  layer={layer}
                  index={idx}
                  totalLayers={layers.length}
                  errors={validationErrors[layer.id]}
                  onUpdate={(updated) => onUpdateLayer(idx, updated)}
                  onDuplicate={() => onDuplicateLayer(idx)}
                  onDelete={() => onDeleteLayer(idx)}
                  onMoveUp={() => onMoveUp(idx)}
                  onMoveDown={() => onMoveDown(idx)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table bottom status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12151f] border-t border-[#202535] text-xs text-slate-500">
        <div>
          <span>Tip: Click any color swatch to pick from the AutoCAD 256-color palette.</span>
        </div>
        <div>
          <button
            type="button"
            onClick={onAddLayer}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            + Add layer
          </button>
        </div>
      </div>
    </div>
  );
};
