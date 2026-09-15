import React, { useState } from 'react';
import type { LayerDefinition, LineWeight } from '../domain/layer';
import type { LayerValidationError } from '../domain/validation';
import { getAciHex, getAciName } from '../autocad/colors';
import { LINEWEIGHT_OPTIONS } from '../autocad/lineweights';
import { LINETYPES_CATALOG } from '../autocad/linetypes';
import { ColorPickerModal } from './ColorPickerModal';
import { LinetypePreview } from './LinetypePreview';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Printer,
  Ban,
  AlertCircle,
} from 'lucide-react';

interface LayerRowProps {
  layer: LayerDefinition;
  index: number;
  totalLayers: number;
  errors?: LayerValidationError[];
  onUpdate: (updated: LayerDefinition) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const LayerRow: React.FC<LayerRowProps> = ({
  layer,
  index,
  totalLayers,
  errors = [],
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const nameError = errors.find((e) => e.field === 'name');
  const colorError = errors.find((e) => e.field === 'color');
  const lwError = errors.find((e) => e.field === 'lineWeight');
  const ltError = errors.find((e) => e.field === 'lineType');

  const hasErrors = errors.length > 0;

  return (
    <>
      <tr
        className={`group border-b border-[#1f2433] transition-colors ${
          hasErrors ? 'bg-red-950/10 hover:bg-red-950/20' : 'hover:bg-[#181c28]'
        }`}
      >
        {/* Reorder & Index */}
        <td className="px-3 py-2 whitespace-nowrap text-center text-xs text-slate-500 font-mono-cad w-14">
          <div className="flex items-center justify-center space-x-0.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              title="Move layer up"
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent"
            >
              <ArrowUp size={13} />
            </button>
            <span className="w-5 text-center">{index + 1}</span>
            <button
              type="button"
              disabled={index === totalLayers - 1}
              onClick={onMoveDown}
              title="Move layer down"
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent"
            >
              <ArrowDown size={13} />
            </button>
          </div>
        </td>

        {/* Layer Name */}
        <td className="px-3 py-2 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={layer.name}
              onChange={(e) => onUpdate({ ...layer, name: e.target.value })}
              placeholder="e.g. АР_Стены"
              className={`w-full px-2.5 py-1.5 bg-[#12151e] border rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-hidden transition-all ${
                nameError
                  ? 'border-red-500 ring-1 ring-red-500/50 bg-red-950/20'
                  : 'border-[#262c3e] focus:border-blue-500 focus:bg-[#161a25]'
              }`}
            />
            {nameError && (
              <div className="flex items-center space-x-1 mt-1 text-[11px] text-red-400 font-medium">
                <AlertCircle size={12} className="flex-shrink-0" />
                <span>{nameError.message}</span>
              </div>
            )}
          </div>
        </td>

        {/* Color (ACI) */}
        <td className="px-3 py-2 whitespace-nowrap w-36">
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsColorModalOpen(true)}
              className={`flex items-center space-x-2 px-2 py-1 bg-[#12151e] border rounded hover:border-[#3d4661] transition-all text-xs font-mono-cad ${
                colorError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#262c3e]'
              }`}
              title="Click to choose AutoCAD color"
            >
              <span
                className="w-4 h-4 rounded-xs border border-white/20 shadow-xs flex-shrink-0"
                style={{ backgroundColor: getAciHex(layer.color) }}
              />
              <span className="text-slate-200 font-semibold">{layer.color}</span>
              {getAciName(layer.color) && (
                <span className="text-slate-500 text-[10px] truncate max-w-[60px]">
                  {getAciName(layer.color)}
                </span>
              )}
            </button>
          </div>
          {colorError && (
            <div className="flex items-center space-x-1 mt-1 text-[11px] text-red-400">
              <AlertCircle size={12} />
              <span>{colorError.message}</span>
            </div>
          )}
        </td>

        {/* Lineweight */}
        <td className="px-3 py-2 whitespace-nowrap w-40">
          <select
            value={String(layer.lineWeight)}
            onChange={(e) => {
              const val = e.target.value === 'Default' ? 'Default' : parseFloat(e.target.value);
              onUpdate({ ...layer, lineWeight: val as LineWeight });
            }}
            className={`w-full px-2.5 py-1.5 bg-[#12151e] border rounded text-xs text-slate-200 font-mono-cad focus:outline-hidden focus:border-blue-500 transition-colors ${
              lwError ? 'border-red-500' : 'border-[#262c3e]'
            }`}
          >
            {LINEWEIGHT_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)} className="bg-[#1a1e2b]">
                {opt.label}
              </option>
            ))}
          </select>
          {lwError && (
            <div className="flex items-center space-x-1 mt-1 text-[11px] text-red-400">
              <AlertCircle size={12} />
              <span>{lwError.message}</span>
            </div>
          )}
        </td>

        {/* Linetype */}
        <td className="px-3 py-2 whitespace-nowrap w-48">
          <div className="space-y-1">
            <select
              value={layer.lineType}
              onChange={(e) => onUpdate({ ...layer, lineType: e.target.value })}
              className={`w-full px-2.5 py-1.5 bg-[#12151e] border rounded text-xs text-slate-200 font-mono-cad focus:outline-hidden focus:border-blue-500 transition-colors ${
                ltError ? 'border-red-500' : 'border-[#262c3e]'
              }`}
            >
              {LINETYPES_CATALOG.map((lt) => (
                <option key={lt.name} value={lt.name} className="bg-[#1a1e2b]">
                  {lt.name}
                </option>
              ))}
            </select>
            <div className="flex items-center px-1">
              <LinetypePreview
                lineType={layer.lineType}
                className="w-full h-2 text-slate-400 opacity-80"
                strokeColor={getAciHex(layer.color)}
              />
            </div>
          </div>
          {ltError && (
            <div className="flex items-center space-x-1 mt-1 text-[11px] text-red-400">
              <AlertCircle size={12} />
              <span>{ltError.message}</span>
            </div>
          )}
        </td>

        {/* Plot (Plot / NoPlot) */}
        <td className="px-3 py-2 whitespace-nowrap text-center w-24">
          <button
            type="button"
            onClick={() => onUpdate({ ...layer, plot: !layer.plot })}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              layer.plot
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60'
                : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-400'
            }`}
            title={layer.plot ? 'Plot is enabled' : 'Plot is disabled (NoPlot)'}
          >
            {layer.plot ? <Printer size={13} /> : <Ban size={13} />}
            <span>{layer.plot ? 'Plot' : 'No'}</span>
          </button>
        </td>

        {/* Actions (Duplicate, Delete) */}
        <td className="px-3 py-2 whitespace-nowrap text-right w-24">
          <div className="flex items-center justify-end space-x-1">
            <button
              type="button"
              onClick={onDuplicate}
              title="Duplicate layer"
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Delete layer"
              className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>

      {/* Color Picker Popover / Modal */}
      <ColorPickerModal
        isOpen={isColorModalOpen}
        currentColor={layer.color}
        onSelectColor={(col) => onUpdate({ ...layer, color: col })}
        onClose={() => setIsColorModalOpen(false)}
      />
    </>
  );
};
