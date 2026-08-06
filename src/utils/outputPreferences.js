import chalk from 'chalk';
import parser from 'yargs-parser';
import { getSettings } from './settings.js';

const defaultChalkLevel = chalk.level;

let runtimePreferences;

const defaultPreferences = {
  color: true,
  emoji: true,
  redact: true,
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const getCLIOutputOverrides = (argv = process.argv) => {
  const parsed = parser(argv);

  return {
    color: hasOwn(parsed, 'color') ? parsed.color : undefined,
    emoji: hasOwn(parsed, 'emoji') ? parsed.emoji : undefined,
    redact: hasOwn(parsed, 'redact') ? parsed.redact : undefined,
  };
};

export const resolveOutputPreferences = (
  argv = process.argv,
  settings = getSettings(),
) => {
  const overrides = getCLIOutputOverrides(argv);

  return {
    color: overrides.color ?? !settings.noColor,
    emoji: overrides.emoji ?? !settings.noEmoji,
    redact: overrides.redact ?? !settings.neverRedact,
  };
};

export const setRuntimeOutputPreferences = (preferences) => {
  runtimePreferences = preferences;
  return runtimePreferences;
};

export const getRuntimeOutputPreferences = () => runtimePreferences
  ?? defaultPreferences;

export const clearRuntimeOutputPreferences = () => {
  runtimePreferences = undefined;
  chalk.level = defaultChalkLevel;
};

export const applyColorPreference = (preferences = getRuntimeOutputPreferences()) => {
  chalk.level = preferences.color ? defaultChalkLevel : 0;
  return preferences.color;
};
