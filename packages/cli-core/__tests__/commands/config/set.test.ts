import { expect } from '@jest/globals';
// eslint-disable-next-line
import * as stdout from '../../../../../testHelpers/stdoutAssertions'
// eslint-disable-next-line
import * as stdin from '../../../../../testHelpers/stdinAssertions'
import SetConfig from '../../../lib/commands/config/set';
import { makeDirectory, saveFile, pathExists } from '../../../lib/fs';
import tests from '../../__dataSets__/setCommand';

let configFile = {};

jest.mock('../../../lib/fs', () => ({
  saveFile: jest.fn(),
  pathExists: jest.fn(),
  makeDirectory: jest.fn(),
}));

jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: () => configFile || {},
}));

const realProcessExit = process.exit;
// eslint-disable-next-line
// @ts-ignore
process.exit = jest.fn();

describe('Set Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterAll(() => {
    process.exit = realProcessExit;
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
    configFile = {};
  });

  test.each(tests)(
    'Will $label',
    async ({
      commandArgs,
      mockPathExists,
      mockSaveFile,
      config,
      expectedConfig,
      expectedOutput,
    }) => {
      // eslint-disable-next-line
      // @ts-ignore
      pathExists.mockReturnValue(mockPathExists);
      // eslint-disable-next-line
      // @ts-ignore
      saveFile.mockReturnValue(mockSaveFile);

      configFile = config;

      await SetConfig.run(commandArgs);

      expect(makeDirectory).not.toHaveBeenCalled();
      expect(expectedOutput).wasOutput();
      if (expectedConfig === false) {
        return;
      }

      expect(saveFile).toHaveBeenCalledWith(
        ...(expectedConfig as Array<unknown>),
      );
    },
  );
});
