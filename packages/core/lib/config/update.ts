import { ConfigData } from '../types/index';
import { ConfigParams } from '../enums/index';
import debug from 'debug';

const log = debug('vonage:cli:config:update');

export const LatestVersion = '2023-03-30';

export type Latest = {
  CONFIG_SCHEMA_VERSION: '2023-03-30'
} & ConfigData

export type Version20220330 = {
  API_KEY: string
  API_SECRET: string
  PRIVATE_KEY: string
  APPLICATION_ID: string
  CONFIG_SCHEMA_VERSION: '2023-03-30'
}

export type VersionZero = {
  apiKey: string
  apiSecret: string
  privateKey: string
  applicationId: string
  CONFIG_SCHEMA_VERSION: never
}

export type Versions = VersionZero | Version20220330 | Latest

const updateFrom0To20220330 = (data: VersionZero): ConfigData => ({
  [ConfigParams.API_KEY]: data?.apiKey || null,
  [ConfigParams.API_SECRET]: data?.apiSecret || null,
  [ConfigParams.PRIVATE_KEY]: data?.privateKey || null,
  [ConfigParams.APPLICATION_ID]: data?.applicationId || null,
});

export const defaultConfig = {
  [ConfigParams.API_KEY]: null,
  [ConfigParams.API_SECRET]: null,
  [ConfigParams.PRIVATE_KEY]: null,
  [ConfigParams.APPLICATION_ID]: null,
};

export const updateConfigData = (data: Versions): ConfigData => {
  const dataVersion = data.CONFIG_SCHEMA_VERSION || 0;
  log(`Data version is ${dataVersion}`);

  switch (dataVersion) {
  case 0:
    log('Updating from version 0');
    return updateFrom0To20220330(data as unknown as VersionZero);
  default:
    log('Data is up to data');
    return data as ConfigData;
  }
};
