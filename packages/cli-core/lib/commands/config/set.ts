import { BaseSetCommand } from '../../baseSetCommand';
import { Args } from '@oclif/core';
import kebabcase from 'lodash.kebabcase';
import snakecase from 'lodash.snakecase';
import { ConfigParams } from '../../enums/index';
import { pathExists } from '../../fs';
import chalk from 'chalk';
import { ConfigFileMissing } from '../../config/error';

export default class SetConfig extends BaseSetCommand<typeof SetConfig> {
  static summary = 'Set config variable';

  static args = {
    setting: Args.string({
      description: 'The setting to set',
      options: Object.values(ConfigParams).map(kebabcase),
      required: true,
      parse: async (value) => snakecase(value).toUpperCase(),
    }),
    value: Args.string({
      description: 'Value to set',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    super.run();
    const { global } = this.flags;
    const checkFile = global
      ? this.vonageConfig.globalConfigFile
      : this.vonageConfig.localConfigFile;

    this.debug(`Checking if ${checkFile} exists`);
    if (!pathExists(checkFile)) {
      throw new ConfigFileMissing();
    }

    const { setting, value } = this.args;
    const location = global ? 'global' : 'local';
    this.log(`Setting ${global ? 'global' : 'local'} ${setting} to: ${value}`);

    const currentSetting = this.vonageConfig.getVariableFrom(
      setting as ConfigParams,
      location,
    );
    this.log(`The current setting is: ${this.ux.dumpValue(currentSetting)}`);

    this.vonageConfig.setVariableFrom(setting as string, location, value);

    const result = this.flags.global
      ? await this.vonageConfig.saveGlobalConfig(this.flags.yes)
      : await this.vonageConfig.saveLocalConfig(this.flags.yes);

    /* istanbul ignore next */
    this.log(result
      ? 'Config file updated! ✅'
      : chalk.bold.red('Config file not updated ❌'));
  }
}
