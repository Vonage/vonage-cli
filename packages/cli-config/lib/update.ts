import { ConfigData } from './types';
import { ConfigParams } from './enums';
import debug from 'debug';

const log = debug('vonage:cli:config:update');

export const LatestVersion = '2023-03-30';

export type Latest = {
  CONFIG_SCHEMA_VERSION: '2023-03-30'
} & ConfigData

export type Version20220330 = {
  API_KEY: string | null
  API_SECRET: string | null
  PRIVATE_KEY: string | null
  APPLICATION_ID: string | null
  CONFIG_SCHEMA_VERSION: '2023-03-30'
}

export type VersionZero = {
  apiKey: string | null
  apiSecret: string | null
  privateKey: string | null
  applicationId: string | null
  CONFIG_SCHEMA_VERSION: never
}

export type Versions = VersionZero | Version20220330 | Latest

const updateFrom0To20220330 = (data: VersionZero): ConfigData => ({
  [ConfigParams.API_KEY]: data.apiKey || null,
  [ConfigParams.API_SECRET]: data.apiSecret || null,
  [ConfigParams.PRIVATE_KEY]: data.privateKey || null,
  [ConfigParams.APPLICATION_ID]: data.applicationId || null,
});

export const defaultConfig = {
  [ConfigParams.API_KEY]: null,
  [ConfigParams.API_SECRET]: null,
  [ConfigParams.PRIVATE_KEY]: null,
  [ConfigParams.APPLICATION_ID]: null,
};

export const defaultConfigWithSchema = {
  ...defaultConfig,
  CONFIG_SCHEMA_VERSION: '2023-03-30',
};

export const updateConfigData = (data: Versions): ConfigData => {
  const dataVersion = data.CONFIG_SCHEMA_VERSION || 0;
  log(`Data version is ${dataVersion}`);

  let updated: ConfigData = defaultConfig;

  switch (dataVersion) {
  case LatestVersion:
    log('Data is up to data');
    updated = {
      ...defaultConfig,
      ...data,
    } as ConfigData;
    break;

  default:
    log('Updating from version 0');
    updated = updateFrom0To20220330(data as unknown as VersionZero);
  }

  return {
    [ConfigParams.API_KEY]: updated.API_KEY,
    [ConfigParams.API_SECRET]: updated.API_SECRET,
    [ConfigParams.PRIVATE_KEY]: updated.PRIVATE_KEY,
    [ConfigParams.APPLICATION_ID]: updated.APPLICATION_ID,
  };
};
