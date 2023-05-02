import { Command, Flags } from '@oclif/core';
import { VonageCommand } from '../vonageCommand';
import { parse } from 'path';
import { ux } from '@oclif/core';
import { ConfigParams, DisplayedSetting } from '../enums/index';
import chalk from 'chalk';
import { ConfigData } from '../types';
import { checkDirectory, makeDirectory } from '../config/writer';
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

  protected async writeConfigFile(
    file: string,
    data: ConfigData,
  ): Promise<boolean> {
    this.debug('Confirming if ok to write');
    let confirmWrite = true;
    this.log('');
    if (!this.flags.yes) {
      this.debug('Yes flag is not set');
      this.outputObject(data);
      confirmWrite = await ux.confirm(`${chalk.bold('Confirm settings')} [y/n]`);
    }

    this.debug(`Can write file? ${confirmWrite}`);
    if (!confirmWrite) {
      this.log(chalk.yellow('Not saving configuration'));
      return false;
    }

    if (!(await this.checkConfigDirectory(file))) {
      this.log(chalk.red('Unable to write config file'));
      return false;
    }

    return true;
  }

  protected async checkConfigDirectory(file: string): Promise<boolean> {
    this.debug(`Checking if directory exsits before writing ${file}`);
    if (checkDirectory(file)) {
      this.debug('Directory exists');
      return true;
    }

    const { dir: directory } = parse(file);
    const touchDirectory = await ux.confirm(
      `${chalk.bold(`Directory`)} [${directory}] ${chalk.bold(
        `does not exist create?`,
      )} [y/n]`,
    );

    this.debug(`Ok to write directory ${touchDirectory}`);
    if (!touchDirectory) {
      this.debug('User declied creating directory');
      return false;
    }

    makeDirectory(file);

    this.debug('Directory created');
    return true;
  }

  protected async writeGlobalConfigFile(): Promise<void> {
    const config = {
      [ConfigParams.API_KEY]: this.vonageConfig.getGlobalConfigVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getGlobalConfigVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getGlobalConfigVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getGlobalConfigVar(
        ConfigParams.APPLICATION_ID,
      ),
    };

    const file = this.vonageConfig.globalConfigFile;
    const okToWrite = await this.writeConfigFile(file, config);

    if (!okToWrite) {
      return;
    }

    this.vonageConfig.saveGlobalConfig();
    this.log(`${chalk.bold('Config file written to')} ${file}`);
  }

  protected async writeLocalConfigFile(): Promise<void> {
    const config = {
      [ConfigParams.API_KEY]: this.vonageConfig.getLocalConfigVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getLocalConfigVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getLocalConfigVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getLocalConfigVar(
        ConfigParams.APPLICATION_ID,
      ),
    };

    const file = this.vonageConfig.localConfigFile;
    const okToWrite = await this.writeConfigFile(file, config);

    if (!okToWrite) {
      return;
    }

    this.debug(`Writing local config ${file}`, config);
    this.vonageConfig.saveLocalConfig();
    this.log(`${chalk.bold('Config file written to')} ${file}`);
  }
}
