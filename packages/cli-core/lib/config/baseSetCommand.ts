import { Command, Flags } from '@oclif/core';
import { VonageCommand } from '../vonageCommand';
import { ux } from '@oclif/core';
import { ConfigParams, DisplayedSetting } from '../enums/index';
import chalk from 'chalk';
import startcase from 'lodash.startcase';
import { ConfigFileMissing } from './error';
import { dumpCommand } from '../ux';

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

  public async run(): Promise<void> {
    const addGlobal = this.flags.global ? ' --global' : '';
    this.errors = {
      [ConfigFileMissing.name]: [
        `You need to run ${dumpCommand(
          `vonage config:setup${addGlobal}`,
        )} before you can set a value`,
      ],
    };
  }

  protected async getNewSetting(
    setting: ConfigParams,
    append = '',
  ): Promise<void> {
    const argumentSetting = this.vonageConfig.getArgVar(setting);

    const defaultSetting = this.vonageConfig.getVariableFrom(
      setting,
      this.flags.global ? 'global' : 'local',
    );

    this.debug(`${setting} from argument ${argumentSetting}`);
    this.debug(`Current ${setting} ${defaultSetting}`);
    const newSetting = argumentSetting
      ? argumentSetting
      : await ux.prompt(
        chalk.bold(startcase(`${DisplayedSetting[setting]}${append}`)),
        {
          required: true,
          default: defaultSetting,
        },
      );

    this.debug(`New ${setting} ${newSetting}`);
    if (this.flags.global) {
      this.vonageConfig.setConfigVar(setting, newSetting);
      return;
    }

    this.vonageConfig.setLocalConfigVar(setting, newSetting);
  }
}
