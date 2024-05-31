import { expect } from '@jest/globals';
import {
  updateConfigData,
  ConfigParams,
  VersionZero,
  Version20220330,
  LatestVersion,
  Latest,
  defaultConfig,
} from '../lib';
import snakecase from 'lodash.snakecase';

describe('Update Config tests', () => {
  const versionZero = {
    apiKey: 'api-key',
    apiSecret: 'api-secret',
    privateKey: '/path/to/file',
    applicationId: 'app-id',
  } as VersionZero;

  const latestConfig = {
    [ConfigParams.API_KEY]: 'api-key',
    [ConfigParams.API_SECRET]: 'api-secret',
    [ConfigParams.PRIVATE_KEY]: '/path/to/file',
    [ConfigParams.APPLICATION_ID]: 'app-id',
  } as Latest;

  test.each([
    ...Object.entries(versionZero).map(([key, value]) => ({
      label: `default to null when only ${key} is set for Verson 0`,
      config: {
        [key]: value,
      } as VersionZero,
      expected: {
        ...defaultConfig,
        [snakecase(key).toUpperCase()]: value,
      },
    })),
    ...Object.entries(latestConfig).map(([key, value]) => ({
      label: `default to null when only ${key} is set for latest`,
      config: {
        [key]: value,
        CONFIG_SCHEMA_VERSION: LatestVersion,
      } as Latest,
      expected: {
        ...defaultConfig,
        [key]: value,
      },
    })),
  ])('Will $label', ({ config, expected }) => {
    expect(true).toBeTruthy();
    expect(updateConfigData(config)).toEqual(expected);
  });

  test('Will update from version 0 to 2023-03-30', () => {
    expect(updateConfigData(versionZero)).toEqual({
      [ConfigParams.API_KEY]: 'api-key',
      [ConfigParams.API_SECRET]: 'api-secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/file',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    } as Version20220330);
  });

  test('Will keep version if latest', () => {
    expect(updateConfigData({
      ...latestConfig,
      CONFIG_SCHEMA_VERSION: LatestVersion,
    })).toEqual({
      [ConfigParams.API_KEY]: 'api-key',
      [ConfigParams.API_SECRET]: 'api-secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/file',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    } as Version20220330);
  });

  test('Will remove extraonus properties', () => {
    const latestConfig = {
      [ConfigParams.API_KEY]: 'api-key',
      [ConfigParams.API_SECRET]: 'api-secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/file',
      [ConfigParams.APPLICATION_ID]: 'app-id',
      CONFIG_SCHEMA_VERSION: LatestVersion,
      fizz: 'buzz',
    };

    expect(updateConfigData(latestConfig as unknown as Latest)).toEqual({
      [ConfigParams.API_KEY]: 'api-key',
      [ConfigParams.API_SECRET]: 'api-secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/file',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    } as Version20220330);
  });
});
