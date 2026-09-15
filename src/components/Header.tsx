import React from 'react';
import { Download, Upload, PlusCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  configName: string;
  onChangeConfigName: (name: string) => void;
  onNewConfiguration: () => void;
  onLoadExample: () => void;
  onExportJson: () => void;
  onOpenImportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  configName,
  onChangeConfigName,
  onNewConfiguration,
  onLoadExample,
  onExportJson,
  onOpenImportModal,
}) => {
  return (
    <header className="bg-[#141722] border-b border-[#242938] px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title and description */}
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
              AC
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0">
              AutoCAD Layer Constructor
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create a layer standard and export it as an AutoCAD script.
          </p>
        </div>

        {/* Configuration Name and Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset controls */}
          <div className="flex items-center space-x-1.5 bg-[#11131a] p-1 rounded-md border border-[#242938]">
            <input
              type="text"
              value={configName}
              onChange={(e) => onChangeConfigName(e.target.value)}
              placeholder="Configuration name"
              className="px-2.5 py-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 font-medium focus:outline-hidden w-36 sm:w-44"
              title="Configuration Name"
            />
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={onNewConfiguration}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#1d2230] hover:bg-[#252b3d] text-slate-300 hover:text-white rounded text-xs font-medium transition-colors border border-[#283044]"
              title="Start a new empty configuration"
            >
              <PlusCircle size={13} />
              <span>New configuration</span>
            </button>

            <button
              type="button"
              onClick={onLoadExample}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#1d2230] hover:bg-[#252b3d] text-blue-400 hover:text-blue-300 rounded text-xs font-medium transition-colors border border-[#283044]"
              title="Load architectural example layers"
            >
              <Sparkles size={13} />
              <span>Load example</span>
            </button>
          </div>

          {/* Import / Export JSON buttons */}
          <div className="flex items-center space-x-1 pl-2 border-l border-[#242938]">
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#1d2230] hover:bg-[#252b3d] text-slate-300 hover:text-white rounded text-xs font-medium transition-colors border border-[#283044]"
              title="Export configuration as JSON file"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={onOpenImportModal}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#1d2230] hover:bg-[#252b3d] text-slate-300 hover:text-white rounded text-xs font-medium transition-colors border border-[#283044]"
              title="Import configuration from JSON file"
            >
              <Upload size={13} />
              <span>Import JSON</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
