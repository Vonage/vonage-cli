import { ConfigData } from '../types/index';
import { readFileSync, existsSync } from 'fs';
import debug from 'debug';
import { updateConfigData, defaultConfig } from './update';

const log = debug('vonage:cli:config:loader');

export const loadConfigFile = (file: string): ConfigData => {
  log(`Loading config from ${file}`);
  if (!existsSync(file)) {
    log(`${file} does not exist`);
    return defaultConfig;
  }

  const fileContents = readFileSync(file).toString();
  log(`Contents of ${file}: `, fileContents);
  try {
    return updateConfigData(JSON.parse(fileContents));
  } catch (error) {
    log(`Failed to parse config file ${error}`);
  }

  return defaultConfig;
};
