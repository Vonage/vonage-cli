import { jest, expect } from '@jest/globals';
import testCases from '../../__dataSets__/showCommand';
import { asMock } from '../../../../../testHelpers/helpers';
import { ConfigParams } from '../../../lib/enums';

jest.unstable_mockModule('../../../lib/config/loader', () => ({
  loadConfigFile: jest.fn(),
}));

const { Command } = await import('@oclif/core');

const logMock = jest.fn();
Command.prototype.log = logMock;

const { loadConfigFile } = await import('../../../lib/config/loader');
const { default: ShowConfig } = await import(
  '../../../lib/commands/config/show'
);
const loadConfigMock = asMock(loadConfigFile);

const defaultConfig = {
  [ConfigParams.API_KEY]: null,
  [ConfigParams.API_SECRET]: null,
  [ConfigParams.APPLICATION_ID]: null,
  [ConfigParams.PRIVATE_KEY]: null,
};

describe('Config Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  beforeEach(() => {
    process.env.VONAGE_API_KEY = 'env-key';
    process.env.VONAGE_API_SECRET = 'env-secret';
    process.env.VONAGE_PRIVATE_KEY = 'env-private-key';
    process.env.VONAGE_APPLICATION_ID = 'env-app-id';
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
  });

  test.each(testCases)(
    'Will $label',
    async ({ commandArgs, expected, clearEnv, config }) => {
      loadConfigMock.mockImplementation((file: string) => {
        return config[file] || defaultConfig;
      });
      if (clearEnv) {
        delete process.env.VONAGE_API_KEY;
        delete process.env.VONAGE_API_SECRET;
        delete process.env.VONAGE_PRIVATE_KEY;
        delete process.env.VONAGE_APPLICATION_ID;
      }

      await ShowConfig.run(commandArgs);

      expect(logMock.mock.calls).toEqual(expected);
    },
  );
});
