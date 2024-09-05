const { confirm } = require('../../../src/ux/confirm');
const fs = require('fs');
const set = require('../../../src/commands/auth/set');
const { getTestMiddlewareArgs } = require('../../common');

jest.mock('fs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage auth set', () => {
  test('should write to the global config file', async () => {
    const args = getTestMiddlewareArgs();

    fs.__addPath(args.config.globalConfigPath);

    await set.handler(args);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      JSON.stringify(
        {
          'api-key': args.apiKey,
          'api-secret': args.apiSecret,
          'private-key': args.privateKey,
          'app-id': args.appId,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('should write to the local config file', async () => {
    const args = getTestMiddlewareArgs();

    await set.handler({
      ...args,
      local: true,
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.localConfigFile,
      JSON.stringify(
        {
          'api-key': args.apiKey,
          'api-secret': args.apiSecret,
          'private-key': args.privateKey,
          'app-id': args.appId,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.localConfigFile);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('should confirm overwriting file then write', async () => {
    const args = getTestMiddlewareArgs();

    fs.__addFile(args.config.localConfigFile, JSON.stringify(args.config.local));

    await set.handler({
      ...args,
      local: true,
    });

    confirm.mockResolvedValue(true);

    expect(confirm).toHaveBeenCalledWith('Configuration file already exists. Overwrite?');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('should confirm overwriting file but not write', async () => {
    const args = getTestMiddlewareArgs();

    fs.__addFile(args.config.localConfigFile, JSON.stringify(args.config.local));

    await set.handler({
      ...args,
      local: true,
    });

    confirm.mockResolvedValue(false);

    expect(confirm).toHaveBeenCalledWith('Configuration file already exists. Overwrite?');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
