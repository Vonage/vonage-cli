import { expect } from '@jest/globals';
import ShowConfig from '../../../lib/commands/config/show';
import testCases from '../../__dataSets__/showCommand';
import { normalize } from 'path';
import { Command } from '@oclif/core';

let configFile = {};
jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: (file: string) => configFile[normalize(file)] || {},
}));

const logMock = jest.fn();
Command.prototype.log = logMock;

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
    configFile = {};
  });

  test.each(testCases)(
    'Will $label',
    async ({ commandArgs, config, expected, clearEnv }) => {
      configFile = config;
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
