import { expect } from '@jest/globals';
// eslint-disable-next-line
import * as stdout from '../../../../../testHelpers/stdoutAssertions'
// eslint-disable-next-line
import * as stdin from '../../../../../testHelpers/stdinAssertions'
import SetupConfig from '../../../lib/commands/config/setup';
import { saveConfigFile } from '../../../lib/config/writer';

let configFile = {};

jest.mock('../../../lib/config/writer', () => ({
  saveConfigFile: jest.fn().mockReturnValue(undefined),
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

  test('Will setup local config', async () => {
    expect('API Key').respondsWith('api key');
    expect('API Secret').respondsWith('api secret');
    expect('Private Key File').respondsWith('/path/to/key');
    expect('Application Id').respondsWith('app-id');
    expect('Confirm settings').willConfirm();

    await SetupConfig.run();
    expect(saveConfigFile).toHaveBeenCalled();
  });
});
