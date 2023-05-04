import { BaseSetCommand } from '../../config/baseSetCommand';
import { Args } from '@oclif/core';
import kebabcase from 'lodash.kebabcase';
import snakecase from 'lodash.snakecase';
import { ConfigParams } from '../../enums/index';
import { pathExists } from '../../fs';

import chalk from 'chalk';

export default class SetConfig extends BaseSetCommand<typeof SetConfig> {
  static summary = 'Set config variable';

  static args = {
    setting: Args.string({
      description: 'The setting to set',
      options: Object.values(ConfigParams).map(kebabcase),
      required: true,
      parse: (value) => snakecase(value).toUpperCase(),
    }),
    value: Args.string({
      description: 'Value to set',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { global } = this.flags;
    const checkFile = global
      ? this.vonageConfig.globalConfigFile
      : this.vonageConfig.localConfigFile;

    this.debug(`Checking if ${checkFile} exists`);
    if (!pathExists(checkFile)) {
      this.log(
        `You need to run "${chalk.green('vonage config:setup')}${
          global ? chalk.green(' --global') : ''
        }" before you can set a value`,
      );
      process.exit(1);
      return;
    }

    const { setting, value } = this.args;
    const location = global ? 'global' : 'local';
    this.log(`Setting ${global ? 'global' : 'local'} ${setting} to: ${value}`);

    const currentSetting = this.vonageConfig.getVariableFrom(setting, location);
    this.log(`The current setting is: ${this.ux.dumpValue(currentSetting)}`);

    this.vonageConfig.setVariableFrom(setting, location, value);

    const result = this.flags.global
      ? await this.vonageConfig.saveGlobalConfig(this.flags.yes)
      : await this.vonageConfig.saveLocalConfig(this.flags.yes);

    this.log(
      result
        ? 'Config file updated! ✅'
        : chalk.bold.red('Config file not updated ❌'),
    );
  }
}
