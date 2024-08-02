import { expect, jest } from '@jest/globals';
import tests from '../../__dataSets__/setCommand';
import { asMock } from '../../../../../testHelpers/helpers';

jest.unstable_mockModule('../../../lib/fs', () => ({
  saveFile: jest.fn(),
  pathExists: jest.fn(),
  makeDirectory: jest.fn(),
}));

jest.unstable_mockModule('../../../lib/config/loader', () => ({
  loadConfigFile: jest.fn(),
}));

const { Command } = await import('@oclif/core');

const logMock = jest.fn();
Command.prototype.log = logMock;

const { makeDirectory, saveFile, pathExists } = await import('../../../lib/fs');
const { loadConfigFile } = await import('../../../lib/config/loader');
const SetConfig = await import('../../../lib/commands/config/set');

const existsMock = asMock(pathExists);
const saveMock = asMock(saveFile);
const dirMock = asMock(makeDirectory);
const loadConfigMock = asMock(loadConfigFile);

describe('Set Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
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
      existsMock.mockReturnValue(mockPathExists);
      saveMock.mockResolvedValue(mockSaveFile);
      loadConfigMock.mockReturnValue(config);

      await SetConfig.default.run(commandArgs);

      expect(dirMock).not.toHaveBeenCalled();
      expect(logMock.mock.calls).toEqual(expectedOutput);
      if (expectedConfig === false) {
        return;
      }

      expect(saveFile).toHaveBeenCalledWith(...(expectedConfig as Array<unknown>));
    },
  );
});
