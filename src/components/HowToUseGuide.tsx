import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

export const HowToUseGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#141722] border border-[#242938] rounded-lg shadow-sm text-xs text-slate-400">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-[#181c28] transition-colors rounded-lg text-left"
      >
        <div className="flex items-center space-x-2">
          <HelpCircle size={15} className="text-blue-400" />
          <span className="font-medium text-slate-300">How to use</span>
          <span className="text-slate-500 hidden sm:inline">— 5-step quick guide for AutoCAD</span>
        </div>
        <div className="text-slate-500">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-[#202535] space-y-2">
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Configure your layers in the table above.</li>
            <li>Download the <code className="text-emerald-400 font-mono-cad text-[11px]">.scr</code> file.</li>
            <li>Open the target drawing in AutoCAD.</li>
            <li>Run the <kbd className="px-1.5 py-0.5 bg-[#202636] border border-[#2d354c] rounded text-slate-200 font-mono-cad text-[11px]">SCRIPT</kbd> command.</li>
            <li>Select the downloaded file.</li>
          </ol>
          <div className="pt-2 text-[11px] text-slate-500 border-t border-[#1c202d] flex items-center space-x-2">
            <Terminal size={13} className="text-slate-400 flex-shrink-0" />
            <span>The script safely creates missing layers and updates properties on any existing layers.</span>
          </div>
        </div>
      )}
    </div>
  );
};
