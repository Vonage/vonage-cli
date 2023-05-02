import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { VonageCommand } from '../../vonageCommand';
import { ConfigParts, ConfigParams, DisplayedSetting } from '../../enums/index';
import { existsSync } from 'fs';
import kebabcase from 'lodash.kebabcase';
import snakecase from 'lodash.snakecase';

const showValue = (value): string => value || chalk.dim.yellow('Not Set');

const echoSetting = (
  setting: ConfigParams,
  part: ConfigParts | null,
  value: string | null,
): string =>
  chalk.bold(`The ${part ? `${part} ` : ''}${DisplayedSetting[setting]} is`)
  + ': '
  + showValue(value);

export default class ShowConfig extends VonageCommand<typeof ShowConfig> {
  static summary = 'Display the current configuration';

  static enableJsonFlag = false;

  static flags = {
    part: Flags.string({
      summary: 'Only show the value from this domain',
      options: Object.values(ConfigParts),
      multiple: true,
    }),
    setting: Flags.string({
      summary: 'Only show this setting',
      multiple: true,
      options: Object.values(ConfigParams).map(kebabcase),
    }),
    verbose: Flags.boolean({
      summary: 'Show detailed configuration information',
      char: 'v',
      allowNo: false,
      default: false,
    }),
  };

  async run(): Promise<void> {
    if (this.flags.verbose) {
      this.dumpConfig(ConfigParts.GLOBAL);
      this.dumpConfig(ConfigParts.LOCAL);
      this.dumpConfig(ConfigParts.ENVIROMENT);
      this.dumpConfig(ConfigParts.ARGUMENTS);
    }
    this.dumpConfig();
  }

  protected getSettings() {
    if (!this.flags.setting) {
      return Object.values(ConfigParams);
    }

    return this.flags.setting.map((value) => snakecase(value).toUpperCase());
  }

  protected truncatePrivateKey(privateKey: string): string {
    return existsSync(privateKey)
      ? privateKey
      : showValue(this.truncate(privateKey));
  }

  protected dumpConfig(from: ConfigParts | null = null): void {
    const { part } = this.flags;
    if (part && !part.includes(from)) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.API_KEY,
          from,
          this.vonageConfig.getVariableFrom(ConfigParams.API_KEY, from),
        ),
      );
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.log(
        echoSetting(
          ConfigParams.API_SECRET,
          from,
          this.vonageConfig.getVariableFrom(ConfigParams.API_SECRET, from),
        ),
      );
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.log(
        echoSetting(
          ConfigParams.APPLICATION_ID,
          from,
          this.vonageConfig.getVariableFrom(ConfigParams.APPLICATION_ID, from),
        ),
      );
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      this.log(
        echoSetting(
          ConfigParams.PRIVATE_KEY,
          from,
          this.truncatePrivateKey(
            this.vonageConfig.getVariableFrom(ConfigParams.PRIVATE_KEY, from),
          ),
        ),
      );
    }
    this.log('');
  }
}
