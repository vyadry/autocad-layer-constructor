import React, { useState } from 'react';
import { ACI_COLOR_MAP, getAciHex, getAciName, isValidAciColor, STANDARD_ACI_COLORS } from '../autocad/colors';
import { X, Check } from 'lucide-react';

interface ColorPickerModalProps {
  isOpen: boolean;
  currentColor: number;
  onSelectColor: (color: number) => void;
  onClose: () => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  currentColor,
  onSelectColor,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <ColorPickerModalDialog
      currentColor={currentColor}
      onSelectColor={onSelectColor}
      onClose={onClose}
    />
  );
};

interface ColorPickerModalDialogProps {
  currentColor: number;
  onSelectColor: (color: number) => void;
  onClose: () => void;
}

const ColorPickerModalDialog: React.FC<ColorPickerModalDialogProps> = ({
  currentColor,
  onSelectColor,
  onClose,
}) => {
  const [selected, setSelected] = useState<number>(currentColor);
  const [inputValue, setInputValue] = useState<string>(String(currentColor));
  const [activeTab, setActiveTab] = useState<'standard' | 'all'>('standard');

  const handleApply = () => {
    if (isValidAciColor(selected)) {
      onSelectColor(selected);
      onClose();
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && isValidAciColor(num)) {
      setSelected(num);
    }
  };

  const handleColorClick = (idx: number) => {
    setSelected(idx);
    setInputValue(String(idx));
  };

  // Generate list of 10 to 249 in steps
  const paletteIndices = Array.from({ length: 240 }, (_, i) => i + 10);
  const grayIndices = [250, 251, 252, 253, 254, 255];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-lg bg-[#151821] border border-[#2d3345] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242938] bg-[#1a1e2b]">
          <div className="flex items-center space-x-2">
            <span
              className="w-4 h-4 rounded-xs border border-white/20"
              style={{ backgroundColor: getAciHex(selected) }}
            />
            <h3 className="font-medium text-sm text-slate-200">
              Select AutoCAD Color (ACI: {selected} {getAciName(selected) ? `— ${getAciName(selected)}` : ''})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-sm hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Quick inputs */}
          <div className="flex items-center space-x-3 bg-[#11131a] p-3 rounded-md border border-[#222736]">
            <div
              className="w-12 h-12 rounded-sm border border-[#3e455c] shadow-inner flex-shrink-0"
              style={{ backgroundColor: getAciHex(selected) }}
            />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                ACI Color Index (1–255)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="255"
                  value={inputValue}
                  onChange={handleNumberChange}
                  className="w-24 px-2 py-1 bg-[#1a1d27] border border-[#2e3447] rounded text-slate-100 text-sm font-mono-cad focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-xs text-slate-500 font-mono-cad">
                  Hex: {getAciHex(selected)}
                </span>
              </div>
            </div>
            <div className="flex space-x-1 bg-[#1a1e2b] p-1 rounded border border-[#282e3f]">
              <button
                type="button"
                onClick={() => setActiveTab('standard')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === 'standard'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                256 Palette
              </button>
            </div>
          </div>

          {/* Standard Colors 1-7 + 8,9 */}
          {activeTab === 'standard' ? (
            <div>
              <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Standard AutoCAD Colors (1–9)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STANDARD_ACI_COLORS.map((col) => {
                  const isCur = selected === col.index;
                  return (
                    <button
                      key={col.index}
                      type="button"
                      onClick={() => handleColorClick(col.index)}
                      className={`flex items-center space-x-2.5 p-2 rounded-md border text-left transition-all ${
                        isCur
                          ? 'border-blue-500 bg-blue-500/15 ring-1 ring-blue-500'
                          : 'border-[#262c3e] bg-[#171b26] hover:border-[#3b4460] hover:bg-[#1f2433]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-xs border border-black/30 shadow-xs flex-shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200">
                          {col.index}: {col.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-cad">{col.hex}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                AutoCAD Full Color Spectrum (ACI 10–255)
              </div>
              <div className="max-h-56 overflow-y-auto pr-1">
                {/* 24 hues grid */}
                <div className="grid grid-cols-10 gap-1 mb-2">
                  {paletteIndices.map((idx) => {
                    const hex = ACI_COLOR_MAP[idx] || '#FFFFFF';
                    const isCur = selected === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleColorClick(idx)}
                        title={`ACI ${idx} (${hex})`}
                        className={`h-5 w-full rounded-xs transition-transform hover:scale-110 relative ${
                          isCur ? 'ring-2 ring-white z-10 scale-110' : ''
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>

                {/* Grays 250-255 */}
                <div className="text-[11px] text-slate-400 mb-1">Grayscales (250–255)</div>
                <div className="grid grid-cols-6 gap-1">
                  {grayIndices.map((idx) => {
                    const hex = ACI_COLOR_MAP[idx] || '#FFFFFF';
                    const isCur = selected === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleColorClick(idx)}
                        title={`ACI ${idx} (${hex})`}
                        className={`h-6 rounded-xs transition-transform hover:scale-105 flex items-center justify-center text-[10px] font-mono-cad ${
                          isCur ? 'ring-2 ring-blue-400' : ''
                        } ${idx > 252 ? 'text-black' : 'text-white'}`}
                        style={{ backgroundColor: hex }}
                      >
                        {idx}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#242938] bg-[#1a1e2b]">
          <span className="text-xs text-slate-400">
            Script will output: <span className="font-mono-cad text-slate-200">{selected}</span>
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#222736] hover:bg-[#2b3144] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center space-x-1 transition-colors"
            >
              <Check size={14} />
              <span>Select Color</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
