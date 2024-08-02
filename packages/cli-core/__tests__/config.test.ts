import { describe, test, expect, jest } from '@jest/globals';
import {
  FSFactory,
  LoadFileCurry,
  SaveFileCurry,
  VonageConfig,
  ConfigParams,
  ConfigEnv,
  ConfigParts,
} from '../lib';

type MockFS = {
  loadFile: jest.MockedFunction<LoadFileCurry> & LoadFileCurry,
  saveFile: jest.MockedFunction<SaveFileCurry>,
} & FSFactory;

const getMockFS = (): MockFS => ({
  loadFile: jest.fn(),
  saveFile: jest.fn(),
} as unknown as MockFS);

const originalProcessEnv = process.env;
describe('Config tests', () => {

  beforeEach(() => {
    delete process.env[ConfigEnv.API_KEY];
    delete process.env[ConfigEnv.API_SECRET];
    delete process.env[ConfigEnv.PRIVATE_KEY];
    delete process.env[ConfigEnv.APPLICATION_ID];
  });

  afterAll(() => {
    process.env = { ...originalProcessEnv };
  });

  test('Will Load all config values', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    process.env[ConfigEnv.API_KEY] = 'env-api-key';
    process.env[ConfigEnv.API_SECRET] = 'env-api-secret';
    process.env[ConfigEnv.PRIVATE_KEY] = 'env-private-key';
    process.env[ConfigEnv.APPLICATION_ID] = 'env-app-id';

    // global config first
    loadFile.mockReturnValueOnce(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'global-api-key',
        [ConfigParams.API_SECRET]: 'global-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'global-private-key',
        [ConfigParams.APPLICATION_ID]: 'global-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    ).mockReturnValue(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'local-api-key',
        [ConfigParams.API_SECRET]: 'local-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'local-private-key',
        [ConfigParams.APPLICATION_ID]: 'local-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    );

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {
        'api-key': 'arg-api-key',
        'api-secret': 'arg-api-secret',
        'private-key': 'arg-private-key',
        'application-id': 'arg-app-id',
      },
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBe('arg-api-key');
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBe('arg-api-secret');
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBe('arg-private-key');
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBe('arg-app-id');

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBe('env-api-key');
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBe('env-api-secret');
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBe('env-private-key');
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBe('env-app-id');

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');

    expect(config.getVar(ConfigParams.API_KEY)).toBe('arg-api-key');
    expect(config.getVar(ConfigParams.API_SECRET)).toBe('arg-api-secret');
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBe('arg-private-key');
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBe('arg-app-id');
  });

  test('Will use env when args not set', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    process.env[ConfigEnv.API_KEY] = 'env-api-key';
    process.env[ConfigEnv.API_SECRET] = 'env-api-secret';
    process.env[ConfigEnv.PRIVATE_KEY] = 'env-private-key';
    process.env[ConfigEnv.APPLICATION_ID] = 'env-app-id';

    // global config first
    loadFile.mockReturnValueOnce(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'global-api-key',
        [ConfigParams.API_SECRET]: 'global-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'global-private-key',
        [ConfigParams.APPLICATION_ID]: 'global-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    ).mockReturnValue(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'local-api-key',
        [ConfigParams.API_SECRET]: 'local-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'local-private-key',
        [ConfigParams.APPLICATION_ID]: 'local-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    );

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBe('env-api-key');
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBe('env-api-secret');
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBe('env-private-key');
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBe('env-app-id');

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');

    expect(config.getVar(ConfigParams.API_KEY)).toBe('env-api-key');
    expect(config.getVar(ConfigParams.API_SECRET)).toBe('env-api-secret');
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBe('env-private-key');
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBe('env-app-id');
  });

  test('Will use local when args and env not set', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    // global config first
    loadFile.mockReturnValueOnce(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'global-api-key',
        [ConfigParams.API_SECRET]: 'global-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'global-private-key',
        [ConfigParams.APPLICATION_ID]: 'global-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    ).mockReturnValue(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'local-api-key',
        [ConfigParams.API_SECRET]: 'local-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'local-private-key',
        [ConfigParams.APPLICATION_ID]: 'local-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    );

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');

    expect(config.getVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');
  });

  test('Will use global when args and env not set', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    // global config first
    loadFile.mockReturnValueOnce(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'global-api-key',
        [ConfigParams.API_SECRET]: 'global-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'global-private-key',
        [ConfigParams.APPLICATION_ID]: 'global-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    );

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');

    expect(config.getVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');
  });

  test('Will use local when global not found', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    loadFile.mockReturnValueOnce(null).mockReturnValueOnce(
      JSON.stringify({
        [ConfigParams.API_KEY]: 'local-api-key',
        [ConfigParams.API_SECRET]: 'local-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'local-private-key',
        [ConfigParams.APPLICATION_ID]: 'local-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      })
    );
    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');
  });

  test('Will null config as default', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    loadFile.mockReturnValue(null);

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBeNull();
  });

  test('Will use default when global or local config is not proper json', () => {
    const fs = getMockFS();
    const { loadFile } = fs;

    (loadFile as
      jest.MockedFunction<LoadFileCurry>).mockReturnValue('not-json');

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getVar(ConfigParams.APPLICATION_ID)).toBeNull();
  });

  test('Will save local config', () => {
    const fs = getMockFS();
    const { loadFile, saveFile } = fs;

    loadFile.mockReturnValue(null);

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    config.setVariableFrom(
      ConfigParams.API_KEY,
      ConfigParts.LOCAL,
      'local-api-key',
    );

    config.setVariableFrom(
      ConfigParams.API_SECRET,
      ConfigParts.LOCAL,
      'local-api-secret',
    );

    config.setVariableFrom(
      ConfigParams.PRIVATE_KEY,
      ConfigParts.LOCAL,
      'local-private-key',
    );

    config.setVariableFrom(
      ConfigParams.APPLICATION_ID,
      ConfigParts.LOCAL,
      'local-app-id',
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBe('local-api-key');
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBe('local-api-secret');
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('local-private-key');
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBe('local-app-id');

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    config.saveLocalConfig();
    expect(saveFile).toHaveBeenCalledWith(
      `${process.cwd()}/vonage_app.json`,
      {
        [ConfigParams.API_KEY]: 'local-api-key',
        [ConfigParams.API_SECRET]: 'local-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'local-private-key',
        [ConfigParams.APPLICATION_ID]: 'local-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
    );
  });

  test('Will save global config', () => {
    const fs = getMockFS();
    const { loadFile, saveFile } = fs;

    loadFile.mockReturnValue(null);

    const config = new VonageConfig(
      fs,
      '/path/to/config',
      {},
    );

    config.setVariableFrom(
      ConfigParams.API_KEY,
      ConfigParts.GLOBAL,
      'global-api-key',
    );

    config.setVariableFrom(
      ConfigParams.API_SECRET,
      ConfigParts.GLOBAL,
      'global-api-secret',
    );

    config.setVariableFrom(
      ConfigParams.PRIVATE_KEY,
      ConfigParts.GLOBAL,
      'global-private-key',
    );

    config.setVariableFrom(
      ConfigParams.APPLICATION_ID,
      ConfigParts.GLOBAL,
      'global-app-id',
    );

    expect(config.getArgVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getArgVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getArgVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getEnvVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getEnvVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getEnvVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getLocalConfigVar(ConfigParams.API_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.API_SECRET)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.PRIVATE_KEY)).toBeNull();
    expect(config.getLocalConfigVar(ConfigParams.APPLICATION_ID)).toBeNull();

    expect(config.getGlobalConfigVar(ConfigParams.API_KEY)).toBe('global-api-key');
    expect(config.getGlobalConfigVar(ConfigParams.API_SECRET)).toBe('global-api-secret');
    expect(config.getGlobalConfigVar(ConfigParams.PRIVATE_KEY)).toBe('global-private-key');
    expect(config.getGlobalConfigVar(ConfigParams.APPLICATION_ID)).toBe('global-app-id');

    config.saveGlobalConfig();
    expect(saveFile).toHaveBeenCalledWith(
      '/path/to/config/vonage.config.json',
      {
        [ConfigParams.API_KEY]: 'global-api-key',
        [ConfigParams.API_SECRET]: 'global-api-secret',
        [ConfigParams.PRIVATE_KEY]: 'global-private-key',
        [ConfigParams.APPLICATION_ID]: 'global-app-id',
        CONFIG_SCHEMA_VERSION: '2023-03-30',
      },
    );
  });
});
