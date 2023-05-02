import { expect } from '@jest/globals';
// Include this in every test file to ensure TS compiles
// eslint-disable-next-line
import * as custom from '../../../../../testHelpers/stdoutAssertions'
import ShowConfig from '../../../lib/commands/config/show';
import testCases from '../../__dataSets__/showCommand';

let configFile = {};
jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: (file) => configFile[file] || {},
}));

describe('Config Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

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

      expect(expected).wasOutput();
    },
  );
});
