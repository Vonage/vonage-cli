/* istanbul ignore file: Mocking the filesystem is not fun  */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'path';
import { ConfigData } from '../types/index';
import { ConfigParams } from '../enums/index';
import debug from 'debug';

const log = debug('vonage:cli:config:writer');

export const CONFIG_SCHEMA_VERSION = '2022-03-30';

export const makeDirectory = (file: string): void => {
  const { dir: directory } = parse(file);
  mkdirSync(directory, { recursive: true });
  log('Directory created');
};

export const checkDirectory = (file: string) => {
  const { dir: directory } = parse(file);
  log(`Checking if ${directory} for config file exists`);

  if (existsSync(directory)) {
    log('Directory exists');
    return true;
  }

  log('Directory does not exist');
  return false;
};

export const saveConfigFile = (file: string, data: ConfigData): void => {
  const saveConfigData = {
    ...data,
    [ConfigParams.CONFIG_SCHEMA_VERSION]: CONFIG_SCHEMA_VERSION,
  };
  log(`Saiving config ${file}`);
  log(saveConfigData);
  writeFileSync(file, JSON.stringify(saveConfigData, null, 2));
  log(`Config file written`);
};
