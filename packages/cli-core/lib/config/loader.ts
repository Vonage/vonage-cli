import { ConfigData } from '../types/index';
import { loadFile } from '../fs';
import debug from 'debug';
import {
  updateConfigData,
  defaultConfigWithSchema,
  Latest,
} from './update';

const log = debug('vonage:cli:config:loader');

export const loadConfigFile = (file: string): ConfigData => {
  let configData = defaultConfigWithSchema;
  try {
    log(`Loading config from ${file}`);
    const fileContents = loadFile(file);
    configData = fileContents
      ? JSON.parse(fileContents)
      : defaultConfigWithSchema ;
    log(`Config from ${file}`, configData);
  } catch (error) {
    log(`Failed to parse config file ${error}`);
  }

  return updateConfigData(configData as Latest);
};
