import { getSharedConfig } from '../middleware/config.js';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';

let settings = null;
let changed = false;

process.on('exit', () => {
  if (changed) {
    saveSettingsFile();
  }
});

const loadSettingsFile = () => {
  const { settingsFile, settingsFileExists } = getSharedConfig();

  if (!settingsFileExists) {
    settings = {};
    return;
  }

  try {
    settings = JSON.parse(readFileSync(settingsFile));
  } catch (error) {
    console.error('Error reading settings file:', error);
    settings = {};
  }
};

const saveSettingsFile = () => {
  const { settingsFile, globalConfigPath} = getSharedConfig();

  if (!existsSync(globalConfigPath)) {
    console.debug(`Creating global config folder: ${globalConfigPath}`);
    mkdirSync(globalConfigPath, { recursive: true });
  }

  console.debug(`Saving settings file to: ${settingsFile}`);

  writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
};

const setSetting = (key, value) => {
  changed = true;
  settings[key] = value;
};

export { setSetting };
export const getSettings = () => {
  if (settings === null) {
    loadSettingsFile();
  }

  return settings;
};

