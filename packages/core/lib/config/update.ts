import { ConfigData } from '../types/index';
import { ConfigParams } from '../enums/index';
import debug from 'debug';

const log = debug('vonage:cli:config:update');

type VersionZero = {
  apiKey: string,
  apiSecret: string
  privateKey: string,
  applicationId: string
}

type Versions = VersionZero | ConfigData | unknown

const updateFrom0To20220330 = (
  data: VersionZero,
) : ConfigData => ({
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
  const dataVersion = data[ConfigParams.CONFIG_SCHEMA_VERSION] || 0;
  log(`Data version is ${dataVersion}`);

  switch(dataVersion) {
  case 0:
    return updateFrom0To20220330(data as VersionZero);
  default:
    return data as ConfigData;
  }
};
