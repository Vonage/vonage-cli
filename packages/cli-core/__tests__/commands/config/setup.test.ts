import { jest, expect } from '@jest/globals';
import chalk from 'chalk';
import { ConfigParams } from '../../../lib/enums';
import { asMock } from '../../../../../testHelpers/helpers';
import { normalize } from 'path';

const promptMock = jest.fn();
jest.unstable_mockModule('../../../lib/fs', () => ({
  __esModule: true,
  pathExists: jest.fn(),
  saveFile: jest.fn(),
  loadFile: jest.fn(),
}));

jest.unstable_mockModule('@oclif/core', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = jest.requireActual('@oclif/core') as any;
  return {
    __esModule: true,
    ...actual,
    ux: {
      ...actual.ux,
      prompt: promptMock,
    },
  };
});

const { Command, ux } = await import('@oclif/core');

const logMock = jest.fn();
Command.prototype.log = logMock;

const globalConfigDir = normalize(`${process.env.XDG_CONFIG_HOME}/@oclif/core`);

const globalConfigFile = normalize(`${globalConfigDir}/vonage.config.json`);
const localConfigDir = normalize(process.cwd());
const localConfigFile = normalize(`${localConfigDir}/vonage_app.json`);

const { pathExists, saveFile } = await import('../../../lib/fs');
const existsMock = asMock(pathExists);
const saveMock = asMock(saveFile);
const promptAsMock = asMock(ux.prompt);

const { default: SetupConfig } = await import('../../../lib/commands/config/setup');

const intro = [
  [chalk.bold(`${' '.repeat(20)}Welcome to Vonage!`)],
  [''],
  [chalk.bold(SetupConfig.description)],
  [chalk.dim('Type "vonage config --help" for more information')],
  [''],
];

describe('Setup Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
  });

  test('Will setup global config', async () => {
    promptAsMock
      .mockResolvedValueOnce('api key')
      .mockResolvedValueOnce('api secret')
      .mockResolvedValueOnce('/path/to/key')
      .mockResolvedValueOnce('app-id');

    saveMock.mockResolvedValue(true);
    await SetupConfig.run(['--global']);

    expect(saveMock).toHaveBeenCalledWith(
      globalConfigFile,
      {
        [ConfigParams.API_KEY]: 'api key',
        [ConfigParams.API_SECRET]: 'api secret',
        [ConfigParams.PRIVATE_KEY]: '/path/to/key',
        [ConfigParams.APPLICATION_ID]: 'app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
      false,
    );
    expect(logMock.mock.calls.slice(1)).toEqual([
      ...intro,
      [`The ${globalConfigFile} will be created`],
      [''],
      ['Config file saved! ✅'],
    ]);
  });

  test('Will setup local config', async () => {
    promptAsMock
      .mockResolvedValueOnce('api key')
      .mockResolvedValueOnce('api secret')
      .mockResolvedValueOnce('/path/to/key')
      .mockResolvedValueOnce('app-id');

    saveMock.mockResolvedValue(true);
    await SetupConfig.run([]);

    expect(saveMock).toHaveBeenCalledWith(
      localConfigFile,
      {
        [ConfigParams.API_KEY]: 'api key',
        [ConfigParams.API_SECRET]: 'api secret',
        [ConfigParams.PRIVATE_KEY]: '/path/to/key',
        [ConfigParams.APPLICATION_ID]: 'app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
      false,
    );
    expect(logMock.mock.calls.slice(1)).toEqual([
      ...intro,
      [`The ${localConfigFile} will be created`],
      [''],
      ['Config file saved! ✅'],
    ]);
  });

  test('Will update config using arguments', async () => {
    saveMock.mockResolvedValue(true);
    existsMock.mockReturnValue(true);

    await SetupConfig.run([
      '--yes',
      '--api-key=api key',
      '--api-secret=api secret',
      '--private-key=/path/to/key',
      '--application-id=app-id',
    ]);

    expect(saveMock).toHaveBeenCalledWith(
      localConfigFile,
      {
        [ConfigParams.API_KEY]: 'api key',
        [ConfigParams.API_SECRET]: 'api secret',
        [ConfigParams.PRIVATE_KEY]: '/path/to/key',
        [ConfigParams.APPLICATION_ID]: 'app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
      true,
    );

    expect(logMock.mock.calls.slice(1)).toEqual([
      ...intro,
      [`The config file: ${localConfigFile} will be updated`],
      [''],
      ['Config file saved! ✅'],
    ]);
  });
});
