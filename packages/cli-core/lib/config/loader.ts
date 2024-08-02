import { ConfigData } from '../types';
import debug from 'debug';
import { updateConfigData, defaultConfigWithSchema, Latest } from './update';
import { LoadFileCurry} from '../fs';

const log = debug('@vonage:cli:config:loader');

export const loadConfigFile = (
  loadFile: LoadFileCurry,
  file: string
): ConfigData => {
  let configData = defaultConfigWithSchema;
  try {
    log(`Loading config from ${file}`);
    const fileContents = loadFile(file);
    configData = fileContents
      ? JSON.parse(fileContents)
      : defaultConfigWithSchema;

    log(`Config from ${file}`, configData);
  } catch (error) {
    log(`Failed to parse config file ${error}`);
  }

  return updateConfigData(configData as Latest);
};
