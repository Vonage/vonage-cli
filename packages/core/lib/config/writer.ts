import { writeFileSync } from 'fs';
import { ConfigData } from '../types/index';
import { ConfigParams } from '../enums/index';
import debug from 'debug';

const log = debug('vonage:cli:config:writer');

export const CONFIG_SCHEMA_VERSION = '2022-03-30';

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
