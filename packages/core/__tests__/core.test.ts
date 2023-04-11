import { expect } from '@jest/globals';
import ShowConfig from '../lib/commands/config/show';

enum Lines {
    HEADER_LINE = 1,
    SEPERATOR_LINE = 2,
    ARGS_LINE = 3,
    ENV_LINE = 4,
    CONFIG_LINE = 5,
    DERIVED_LINE = 6,
    CONFIG_FILE_LINE = 7,
}

describe('Config Command', () => {
  const OLD_ENV = Object.assign({}, process.env);

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('Will use settings from config', async () => {
    delete process.env.VONAGE_API_KEY;
    delete process.env.VONAGE_API_SECRET;
    delete process.env.VONAGE_PRIVATE_KEY;
    delete process.env.VONAGE_APPLICATION_ID;

    await ShowConfig.run([]);

    expect(
      `Derived value    config-api-key config-api-secret config-private-key config-app-id`,
    ).isOnLine(Lines.DERIVED_LINE);
  });

  test('Will use settings from env', async () => {
    await ShowConfig.run([]);

    expect(
      `Derived value    env-key        env-secret        env-private-key    env-app-id`,
    ).isOnLine(Lines.DERIVED_LINE);
  });

  test('Will use settings from args', async () => {
    await ShowConfig.run([
      '--api-key=my-key',
      '--api-secret=my-secret',
      '--private-key=my-private-key',
      '--application-id=my-application',
    ]);

    expect(
      `Derived value    my-key         my-secret         my-private-key     my-application`,
    ).isOnLine(Lines.DERIVED_LINE);
  });
});
