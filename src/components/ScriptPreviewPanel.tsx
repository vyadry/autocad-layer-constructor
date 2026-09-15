import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, AlertTriangle } from 'lucide-react';
import { downloadTextFile } from '../importExport/json';

interface ScriptPreviewPanelProps {
  scriptContent: string;
  configName: string;
  isValid: boolean;
  totalErrors: number;
}

export const ScriptPreviewPanel: React.FC<ScriptPreviewPanelProps> = ({
  scriptContent,
  configName,
  isValid,
  totalErrors,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!isValid || !scriptContent) return;
    try {
      await navigator.clipboard.writeText(scriptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = scriptContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!isValid || !scriptContent) return;
    const sanitized = configName
      .trim()
      .replace(/[^a-zA-Z0-9_\-\u0400-\u04FF]/g, '_')
      .toLowerCase();
    const filename = sanitized ? `${sanitized}.scr` : 'autocad-layers.scr';
    downloadTextFile(filename, scriptContent, 'text/plain;charset=utf-8');
  };

  const lineCount = scriptContent ? scriptContent.split('\n').length : 0;

  return (
    <div className="bg-[#141722] border border-[#242938] rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242938] bg-[#191d2b]">
        <div className="flex items-center space-x-2">
          <FileCode size={16} className="text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Generated AutoCAD Script (.scr)
          </span>
          {isValid && scriptContent && (
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded font-mono-cad">
              {lineCount} lines
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={!isValid || !scriptContent}
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#202636] hover:bg-[#2a3247] text-slate-200 disabled:opacity-40 disabled:hover:bg-[#202636] rounded text-xs font-medium transition-colors border border-[#2d354c]"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            disabled={!isValid || !scriptContent}
            onClick={handleDownload}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 rounded text-xs font-medium transition-colors shadow-xs"
            title={
              !isValid
                ? 'Resolve validation errors to download script'
                : 'Download .scr file for AutoCAD'
            }
          >
            <Download size={14} />
            <span>Download .scr</span>
          </button>
        </div>
      </div>

      {/* Validation alert banner */}
      {!isValid && (
        <div className="bg-amber-950/40 border-b border-amber-800/50 px-4 py-2.5 flex items-center space-x-2 text-xs text-amber-300">
          <AlertTriangle size={15} className="flex-shrink-0 text-amber-400" />
          <span>
            {totalErrors > 0
              ? `Configuration has ${totalErrors} validation error${
                  totalErrors > 1 ? 's' : ''
                }. Resolve them to enable export.`
              : 'Add at least one layer to generate script.'}
          </span>
        </div>
      )}

      {/* Code preview area */}
      <div className="p-4 flex-1 bg-[#0d0f15] overflow-auto max-h-[500px]">
        {isValid && scriptContent ? (
          <pre className="text-xs font-mono-cad text-slate-300 leading-relaxed select-all whitespace-pre">
            {scriptContent}
          </pre>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
            <FileCode size={32} className="opacity-30 mb-2" />
            <p>
              {totalErrors > 0
                ? 'Fix inline errors in the layer table above.'
                : 'No layers configured.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[#10131d] border-t border-[#202535] flex items-center justify-between text-[11px] text-slate-500 font-mono-cad">
        <span>Suggested filename: {configName ? `${configName.toLowerCase().replace(/\s+/g, '_')}.scr` : 'autocad-layers.scr'}</span>
        <span>Standard: acad.lin / _.-LAYER</span>
      </div>
    </div>
  );
};
