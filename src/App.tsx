import React, { useState, useEffect, useMemo } from 'react';
import {
  createDefaultLayer,
  generateLayerId,
  type LayerConfiguration,
  type LayerDefinition,
} from './domain/layer';
import { validateAllLayers } from './domain/validation';
import { generateLayerScript } from './autocad/generateLayerScript';
import {
  loadConfigurationFromStorage,
  saveConfigurationToStorage,
} from './persistence/localStorage';
import { exportConfigurationToJson, downloadTextFile } from './importExport/json';
import { getExampleConfiguration, getNewConfiguration } from './domain/presets';

import { Header } from './components/Header';
import { HowToUseGuide } from './components/HowToUseGuide';
import { LayerTable } from './components/LayerTable';
import { ScriptPreviewPanel } from './components/ScriptPreviewPanel';
import { ImportJsonModal } from './components/ImportJsonModal';

export const App: React.FC = () => {
  // Initialize from localStorage or default to architectural example preset
  const [config, setConfig] = useState<LayerConfiguration>(() => {
    const saved = loadConfigurationFromStorage();
    if (saved && saved.layers && saved.layers.length > 0) {
      return saved;
    }
    return getExampleConfiguration();
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Automatically persist configuration to localStorage whenever it changes
  useEffect(() => {
    saveConfigurationToStorage(config);
  }, [config]);

  // Validate layers
  const validation = useMemo(() => {
    return validateAllLayers(config.layers);
  }, [config.layers]);

  // Generate AutoCAD .scr script
  const generatedScript = useMemo(() => {
    if (!validation.isValid) return '';
    return generateLayerScript(config.layers);
  }, [config.layers, validation.isValid]);

  // Layer manipulation handlers
  const handleUpdateLayer = (index: number, updated: LayerDefinition) => {
    setConfig((prev) => {
      const nextLayers = [...prev.layers];
      nextLayers[index] = updated;
      return { ...prev, layers: nextLayers };
    });
  };

  const handleAddLayer = () => {
    setConfig((prev) => ({
      ...prev,
      layers: [...prev.layers, createDefaultLayer()],
    }));
  };

  const handleDuplicateLayer = (index: number) => {
    setConfig((prev) => {
      const source = prev.layers[index];
      const duplicated: LayerDefinition = {
        ...source,
        id: generateLayerId(),
        name: `${source.name}_copy`,
      };
      const nextLayers = [...prev.layers];
      nextLayers.splice(index + 1, 0, duplicated);
      return { ...prev, layers: nextLayers };
    });
  };

  const handleDeleteLayer = (index: number) => {
    setConfig((prev) => {
      const nextLayers = prev.layers.filter((_, idx) => idx !== index);
      return { ...prev, layers: nextLayers };
    });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setConfig((prev) => {
      const nextLayers = [...prev.layers];
      const temp = nextLayers[index];
      nextLayers[index] = nextLayers[index - 1];
      nextLayers[index - 1] = temp;
      return { ...prev, layers: nextLayers };
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= config.layers.length - 1) return;
    setConfig((prev) => {
      const nextLayers = [...prev.layers];
      const temp = nextLayers[index];
      nextLayers[index] = nextLayers[index + 1];
      nextLayers[index + 1] = temp;
      return { ...prev, layers: nextLayers };
    });
  };

  const handleExportJson = () => {
    const jsonStr = exportConfigurationToJson(config);
    const sanitized = (config.name || 'layers')
      .trim()
      .replace(/[^a-zA-Z0-9_\-\u0400-\u04FF]/g, '_')
      .toLowerCase();
    downloadTextFile(`${sanitized}.json`, jsonStr, 'application/json');
  };

  const handleImportConfiguration = (newConfig: LayerConfiguration) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d13] text-slate-100">
      {/* App Header */}
      <Header
        configName={config.name}
        onChangeConfigName={(name) => setConfig((prev) => ({ ...prev, name }))}
        onNewConfiguration={() => setConfig(getNewConfiguration())}
        onLoadExample={() => setConfig(getExampleConfiguration())}
        onExportJson={handleExportJson}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      {/* Main CAD Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Instructions banner */}
        <HowToUseGuide />

        {/* Central Layout: Table & Script Preview */}
        <div className="space-y-6">
          {/* Layer Table */}
          <section>
            <LayerTable
              layers={config.layers}
              validationErrors={validation.errors}
              onUpdateLayer={handleUpdateLayer}
              onAddLayer={handleAddLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onDeleteLayer={handleDeleteLayer}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </section>

          {/* AutoCAD Script Output & Preview */}
          <section>
            <ScriptPreviewPanel
              scriptContent={generatedScript}
              configName={config.name}
              isValid={validation.isValid}
              totalErrors={validation.totalErrors}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1b1f2b] py-3 text-center text-xs text-slate-600">
        <span>AutoCAD Layer Constructor MVP — pure client-side script generator</span>
      </footer>

      {/* Import Modal */}
      <ImportJsonModal
        isOpen={isImportModalOpen}
        onImport={handleImportConfiguration}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default App;
