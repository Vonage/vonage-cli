import { expect } from '@jest/globals';
// eslint-disable-next-line
import * as stdout from '../../../../../testHelpers/stdoutAssertions'
// eslint-disable-next-line
import * as stdin from '../../../../../testHelpers/stdinAssertions'
import SetupConfig from '../../../lib/commands/config/setup';
import { makeDirectory, saveFile, pathExists } from '../../../lib/fs';
import { ConfigParams } from '../../../lib/enums';
import { normalize } from 'path';

const globalConfigDir = normalize(
  `${process.env.XDG_CONFIG_HOME}/@vonage/cli-core`,
);

const globalConfigFile = normalize(`${globalConfigDir}/vonage.config.json`);
const localConfigDir = normalize(process.cwd());
const localConfigFile = normalize(`${localConfigDir}/vonage_app.json`);

let configFile = {};

jest.mock('../../../lib/fs', () => ({
  saveFile: jest.fn(),
  pathExists: jest.fn(),
  makeDirectory: jest.fn(),
}));

jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: (file) => configFile[normalize(file)] || {},
}));

describe('Setup Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
    configFile = {};
  });

  test('Will setup global config', async () => {
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run(['--global']);

    expect(saveFile).toHaveBeenCalledWith(
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
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    pathExists.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run([]);
    expect(saveFile).toHaveBeenCalledWith(
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
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup global config without confirming', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    pathExists.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run(['--global', '--yes']);
    expect(saveFile).toHaveBeenCalledWith(
      globalConfigFile,
      {
        [ConfigParams.API_KEY]: 'api key',
        [ConfigParams.API_SECRET]: 'api secret',
        [ConfigParams.PRIVATE_KEY]: '/path/to/key',
        [ConfigParams.APPLICATION_ID]: 'app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
      true,
    );
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config without confirming', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    pathExists.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run(['--yes']);
    expect(saveFile).toHaveBeenCalledWith(
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
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup global config using arguments', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    pathExists.mockReturnValue(true);
    await SetupConfig.run([
      '--global',
      '--yes',
      '--api-key=api key',
      '--api-secret=api secret',
      '--private-key=/path/to/key',
      '--application-id=app-id',
    ]);

    expect(saveFile).toHaveBeenCalledWith(
      globalConfigFile,
      {
        [ConfigParams.API_KEY]: 'api key',
        [ConfigParams.API_SECRET]: 'api secret',
        [ConfigParams.PRIVATE_KEY]: '/path/to/key',
        [ConfigParams.APPLICATION_ID]: 'app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
      true,
    );
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config using arguments', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    pathExists.mockReturnValue(true);
    await SetupConfig.run([
      '--yes',
      '--api-key=api key',
      '--api-secret=api secret',
      '--private-key=/path/to/key',
      '--application-id=app-id',
    ]);

    expect(saveFile).toHaveBeenCalledWith(
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
    expect(makeDirectory).not.toHaveBeenCalled();
  });
});
