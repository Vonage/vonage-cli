import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { VonageCommand } from '../../vonageCommand';
import { ConfigParams } from '../../enums/index';
import { existsSync } from 'fs';
import { truncate } from '../../ui';
import kebabcase from 'lodash.kebabcase';
import snakecase from 'lodash.snakecase';

enum DisplayedSetting {
    API_KEY = 'API key',
    API_SECRET = 'API secret',
    PRIVATE_KEY = 'private key',
    APPLICATION_ID = 'application ID',
}

const truncatePrivateKey = (privateKey: string): string =>
  existsSync(privateKey) ? privateKey : showValue(truncate(privateKey));

const showValue = (value): string => value || chalk.dim.yellow('Not Set');

const echoSetting = (
  setting: ConfigParams,
  part: 'global' | 'local' | 'environment' | 'arguments' | 'derived',
  value: string | null,
): string =>
  chalk.bold(`The ${part} ${DisplayedSetting[setting]} is`)
    + ': '
    + showValue(value);

export default class ShowConfig extends VonageCommand<typeof ShowConfig> {
  static summary = 'Display the current configuration';

  static flags = {
    part: Flags.string({
      summary: 'Only show the value from this domain',
      options: ['global', 'local', 'environment', 'arguments', 'derived'],
      multiple: true,
    }),
    setting: Flags.string({
      summary: 'Only show this setting',
      multiple: true,
      options: Object.values(ConfigParams).map(kebabcase),
    }),
  };

  async run(): Promise<void> {
    this.dumpGlobalConfig();
    this.dumpLocalConfig();
    this.dumpEnvConfig();
    this.dumpArgsConfig();
    this.dumpDerivedConfig();
  }

  protected getSettings() {
    if (!this.flags?.setting) {
      return Object.values(ConfigParams);
    }

    return this.flags.setting.map((value) => snakecase(value).toUpperCase());
  }

  dumpGlobalConfig(): void {
    const { part } = this.flags;
    if (part && !part.includes('global')) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          'global',
          this.vonageConfig.getGlobalConfigVar(ConfigParams.API_KEY),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          'global',
          this.vonageConfig.getGlobalConfigVar(
            ConfigParams.API_SECRET,
          ),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          'global',
          this.vonageConfig.getGlobalConfigVar(
            ConfigParams.APPLICATION_ID,
          ),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          'global',
          truncatePrivateKey(
            this.vonageConfig.getGlobalConfigVar(
              ConfigParams.PRIVATE_KEY,
            ),
          ),
        ),
      );
    }
    this.log('');
  }

  dumpLocalConfig(): void {
    const { part } = this.flags;
    if (part && !part.includes('local')) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          'local',
          this.vonageConfig.getLocalConfigVar(ConfigParams.API_KEY),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          'local',
          this.vonageConfig.getLocalConfigVar(ConfigParams.API_SECRET),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          'local',
          this.vonageConfig.getLocalConfigVar(
            ConfigParams.APPLICATION_ID,
          ),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          'local',
          truncatePrivateKey(
            this.vonageConfig.getLocalConfigVar(
              ConfigParams.PRIVATE_KEY,
            ),
          ),
        ),
      );
    }
    this.log('');
  }

  dumpEnvConfig(): void {
    const { part } = this.flags;
    if (part && !part.includes('environment')) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          'environment',
          this.vonageConfig.getEnvVar(ConfigParams.API_KEY),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          'environment',
          this.vonageConfig.getEnvVar(ConfigParams.API_SECRET),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          'environment',
          this.vonageConfig.getEnvVar(ConfigParams.APPLICATION_ID),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          'environment',
          truncatePrivateKey(
            this.vonageConfig.getEnvVar(ConfigParams.PRIVATE_KEY),
          ),
        ),
      );
    }
    this.log('');
  }

  dumpArgsConfig(): void {
    const { part } = this.flags;
    if (part && !part.includes('arguments')) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          'arguments',
          this.vonageConfig.getArgVar(ConfigParams.API_KEY),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          'arguments',
          this.vonageConfig.getArgVar(ConfigParams.API_SECRET),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          'arguments',
          this.vonageConfig.getArgVar(ConfigParams.APPLICATION_ID),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          'arguments',
          truncatePrivateKey(
            this.vonageConfig.getArgVar(ConfigParams.PRIVATE_KEY),
          ),
        ),
      );
    }
    this.log('');
  }

  dumpDerivedConfig(): void {
    const { part } = this.flags;
    if (part && !part.includes('derived')) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          'derived',
          this.vonageConfig.getVar(ConfigParams.API_KEY),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          'derived',
          this.vonageConfig.getVar(ConfigParams.API_SECRET),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          'derived',
          this.vonageConfig.getVar(ConfigParams.APPLICATION_ID),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          'derived',
          truncatePrivateKey(
            this.vonageConfig.getVar(ConfigParams.PRIVATE_KEY),
          ),
        ),
      );
    }
    this.log('');
  }
}
