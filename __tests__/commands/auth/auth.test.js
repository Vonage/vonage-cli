process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const { handler } = require('../../../src/commands/auth');
const { mockConsole } = require('../../helpers');
const { getTestData } = require('../../common');

describe('Command: vonage jwt create', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('should show the table of configs', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
    });

    const { config } = globalArgs;
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
    expect(consoleMock.log.mock.calls[3][0]).toBe(`The local configuration file is ${config.localConfigFile}`);
    expect(consoleMock.log.mock.calls[4][0]).toBe(`The global configuration file is ${config.globalConfigFile}`);
    expect(consoleMock.table.mock.calls[0][0]).toEqual([
      {
        'API Key': config.cli.apiKey,
        'API Secret': config.cli.apiSecret,
        'Private Key': config.cli.privateKey,
        'Application ID': config.cli.appId,
        'Source': 'CLI arguments',
      },
    ]);
  });

  test('should show the table of configs for global only', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      global: true,
    });

    const {config } = globalArgs;
    expect(consoleMock.table.mock.calls[0][0]).toEqual([
      {
        'API Key': config.global.apiKey,
        'API Secret': config.global.apiSecret,
        'Private Key': config.global.privateKey,
        'Application ID': config.global.appId,
        'Source': 'Global file',
      },
    ]);
  });

  test('should show the table of configs for local only', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      local: true,
    });

    const {config } = globalArgs;
    expect(consoleMock.table.mock.calls[0][0]).toEqual([
      {
        'Source': 'Local file',
        'API Key': config.local.apiKey,
        'API Secret': config.local.apiSecret,
        'Private Key': config.local.privateKey,
        'Application ID': config.local.appId,
      },
    ]);
  });

  test('should dump the JSON of the local config', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      local: true,
      json: true,
    });

    const {config} = globalArgs;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[JSON.stringify(config.local, null, 2)]]);
  });

  test('should dump the JSON of the global config', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      global: true,
      json: true,
    });

    const {config} = globalArgs;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[JSON.stringify(config.global, null, 2)]]);
  });

  test('should dump the YAML of the local config', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      local: true,
      yaml: true,
    });

    const {config} = globalArgs;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[yaml.stringify(config.local, null, 2)]]);
  });

  test('should dump the YAML of the global config', async () => {
    const { globalArgs } = getTestData();
    handler({
      ...globalArgs,
      global: true,
      yaml: true,
    });

    const {config} = globalArgs;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[yaml.stringify(config.global, null, 2)]]);
  });
});
