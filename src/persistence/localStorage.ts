import type { LayerConfiguration } from '../domain/layer';

const STORAGE_KEY = 'autocad_layer_constructor_state_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export interface StoredStateV1 {
  schemaVersion: 1;
  configuration: LayerConfiguration;
  savedAt: string;
}

export function saveConfigurationToStorage(config: LayerConfiguration): void {
  try {
    const payload: StoredStateV1 = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      configuration: config,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save layer configuration to localStorage:', err);
  }
}

export function loadConfigurationFromStorage(): LayerConfiguration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    // Version migration hook for future versions
    if (parsed && parsed.schemaVersion === 1 && parsed.configuration) {
      return parsed.configuration;
    }

    return null;
  } catch (err) {
    console.warn('Failed to load layer configuration from localStorage:', err);
    return null;
  }
}

export function clearStoredConfiguration(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage configuration:', err);
  }
}
