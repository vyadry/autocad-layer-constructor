import React, { useState, useRef } from 'react';
import type { LayerConfiguration } from '../domain/layer';
import { importConfigurationFromJson } from '../importExport/json';
import { X, Upload, AlertCircle, FileText } from 'lucide-react';

interface ImportJsonModalProps {
  isOpen: boolean;
  onImport: (config: LayerConfiguration) => void;
  onClose: () => void;
}

export const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onImport,
  onClose,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      setErrorMessage(null);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file from disk.');
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    setErrorMessage(null);
    const result = importConfigurationFromJson(jsonText);
    if (!result.success || !result.configuration) {
      setErrorMessage(result.error || 'Failed to parse configuration');
      return;
    }

    onImport(result.configuration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-lg bg-[#151821] border border-[#2d3345] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242938] bg-[#1a1e2b]">
          <div className="flex items-center space-x-2">
            <Upload size={16} className="text-blue-400" />
            <h3 className="font-medium text-sm text-slate-200">Import Configuration (JSON)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-sm hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Paste JSON content below or upload a saved configuration file:
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#202636] hover:bg-[#2b3348] text-slate-200 rounded text-xs transition-colors border border-[#2e374e]"
            >
              <FileText size={13} />
              <span>Choose File</span>
            </button>
          </div>

          <textarea
            rows={8}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setErrorMessage(null);
            }}
            placeholder='{\n  "version": 1,\n  "name": "АР Standard",\n  "layers": [...]\n}'
            className="w-full p-2.5 bg-[#0e1017] border border-[#262c3d] rounded text-xs font-mono-cad text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-blue-500 transition-colors"
          />

          {errorMessage && (
            <div className="flex items-start space-x-2 p-2.5 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 px-4 py-3 border-t border-[#242938] bg-[#1a1e2b]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#222736] hover:bg-[#2b3144] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!jsonText.trim()}
            onClick={handleApplyImport}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};
