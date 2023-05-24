import { expect } from '@jest/globals';
import SetConfig from '../../../lib/commands/config/set';
import { makeDirectory, saveFile, pathExists } from '../../../lib/fs';
import tests from '../../__dataSets__/setCommand';
import { Command } from '@oclif/core';
import { asMock } from '../../../../../testHelpers/helpers';

const logMock = jest.fn();
Command.prototype.log = logMock;

let configFile = {};

jest.mock('../../../lib/fs', () => ({
  saveFile: jest.fn(),
  pathExists: jest.fn(),
  makeDirectory: jest.fn(),
}));

jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: () => configFile || {},
}));

const existsMock = asMock(pathExists);
const saveMock = asMock(saveFile);
const dirMock = asMock(makeDirectory);

describe('Set Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

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
      existsMock.mockReturnValue(mockPathExists);
      saveMock.mockResolvedValue(mockSaveFile);

      configFile = config;

      await SetConfig.run(commandArgs);

      expect(dirMock).not.toHaveBeenCalled();
      expect(logMock.mock.calls).toEqual(expectedOutput);
      if (expectedConfig === false) {
        return;
      }

      expect(saveFile).toHaveBeenCalledWith(
        ...(expectedConfig as Array<unknown>),
      );
    },
  );
});
