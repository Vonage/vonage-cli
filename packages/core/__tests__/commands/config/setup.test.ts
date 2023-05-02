import { expect } from '@jest/globals';
// eslint-disable-next-line
import * as stdout from '../../../../../testHelpers/stdoutAssertions'
// eslint-disable-next-line
import * as stdin from '../../../../../testHelpers/stdinAssertions'
import SetupConfig from '../../../lib/commands/config/setup';
import {
  makeDirectory,
  saveConfigFile,
  checkDirectory,
} from '../../../lib/config/writer';
import { ConfigParams } from '../../../lib/enums';

const globalConfigDir = `${process.env.XDG_CONFIG_HOME}/@vonage/cli-core`;
const globalConfigFile = `${globalConfigDir}/vonage.config.json`;
const localConfigDir = process.cwd();
const localConfigFile = `${localConfigDir}/vonage_app.json`;

let configFile = {};

jest.mock('../../../lib/config/writer', () => ({
  saveConfigFile: jest.fn(),
  checkDirectory: jest.fn(),
  makeDirectory: jest.fn(),
}));

jest.mock('../../../lib/config/loader', () => ({
  loadConfigFile: (file) => configFile[file] || {},
}));

describe('Setup Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
    configFile = {};
  });

  test('Will setup global config', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').willConfirm();

    await SetupConfig.run(['--global']);

    expect(saveConfigFile).toHaveBeenCalledWith(globalConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').willConfirm();

    await SetupConfig.run();
    expect(saveConfigFile).toHaveBeenCalledWith(localConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup global config without confirming', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run(['--global', '--yes']);
    expect(saveConfigFile).toHaveBeenCalledWith(globalConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config without confirming', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');

    await SetupConfig.run(['--yes']);
    expect(saveConfigFile).toHaveBeenCalledWith(localConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup global config using arguments', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    await SetupConfig.run([
      '--global',
      '--yes',
      '--api-key=api key',
      '--api-secret=api secret',
      '--private-key=/path/to/key',
      '--application-id=app-id',
    ]);

    expect(saveConfigFile).toHaveBeenCalledWith(globalConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup local config using arguments', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    await SetupConfig.run([
      '--yes',
      '--api-key=api key',
      '--api-secret=api secret',
      '--private-key=/path/to/key',
      '--application-id=app-id',
    ]);

    expect(saveConfigFile).toHaveBeenCalledWith(localConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will setup global config and create the directory', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(false);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').willConfirm();
    expect(
      `Directory [${globalConfigDir}] does not exist create?`,
    ).willConfirm();

    await SetupConfig.run(['--global']);

    expect(saveConfigFile).toHaveBeenCalledWith(globalConfigFile, {
      [ConfigParams.API_KEY]: 'api key',
      [ConfigParams.API_SECRET]: 'api secret',
      [ConfigParams.PRIVATE_KEY]: '/path/to/key',
      [ConfigParams.APPLICATION_ID]: 'app-id',
    });
    expect(makeDirectory).toHaveBeenCalledWith(globalConfigFile);
  });

  test('Will not setup global config user declines', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').not.willConfirm();

    await SetupConfig.run(['--global']);
    expect(saveConfigFile).not.toHaveBeenCalled();
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will not setup local config user declines', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(true);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').not.willConfirm();

    await SetupConfig.run();
    expect(saveConfigFile).not.toHaveBeenCalled();
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will not setup global config user declines to create directory', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(false);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').willConfirm();
    expect(
      `Directory [${globalConfigDir}] does not exist create?`,
    ).not.willConfirm();

    await SetupConfig.run(['--global']);
    expect(saveConfigFile).not.toHaveBeenCalled();
    expect(makeDirectory).not.toHaveBeenCalled();
  });

  test('Will not setup local config user declines to create directory', async () => {
    // This may seem like a usless test, but the user executing the CLI might
    // not have access to read or write to the CWD
    // eslint-disable-next-line
    // @ts-ignore
    checkDirectory.mockReturnValue(false);
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application ID').respondsWith('app-id');
    expect('Confirm settings').willConfirm();
    expect(
      `Directory [${localConfigDir}] does not exist create?`,
    ).not.willConfirm();

    await SetupConfig.run([]);
    expect(saveConfigFile).not.toHaveBeenCalled();
    expect(makeDirectory).not.toHaveBeenCalled();
  });
});
