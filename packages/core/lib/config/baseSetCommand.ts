import { Command, Flags } from '@oclif/core';
import { VonageCommand } from '../vonageCommand';
import { ux } from '@oclif/core';
import { ConfigParams, DisplayedSetting } from '../enums/index';
import chalk from 'chalk';
import startcase from 'lodash.startcase';

export abstract class BaseSetCommand<
  T extends typeof Command
> extends VonageCommand<T> {
  static flags = {
    yes: Flags.boolean({
      char: 'y',
      summary: 'Write the config without confirmation',
      allowNo: false,
    }),
    global: Flags.boolean({
      char: 'g',
      summary: 'Write the global config file',
      allowNo: false,
    }),
  };

  static enableJsonFlag = false;

  protected async getNewSetting(
    setting: ConfigParams,
    append = '',
  ): Promise<void> {
    const argumentSetting = this.vonageConfig.getArgVar(setting);
    const newSetting = argumentSetting
      ? argumentSetting
      : await ux.prompt(
        chalk.bold(startcase(`${DisplayedSetting[setting]}${append}`)),
        {
          required: true,
          default: this.flags.global
            ? this.vonageConfig.getGlobalConfigVar(setting)
            : this.vonageConfig.getLocalConfigVar(setting),
        },
      );

    if (this.flags.global) {
      this.vonageConfig.setConfigVar(setting, newSetting);
      return;
    }

    this.vonageConfig.setLocalConfigVar(setting, newSetting);
  }
}
