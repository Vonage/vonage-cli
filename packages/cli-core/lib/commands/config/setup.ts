import { existsSync } from 'fs';
import { BaseSetCommand } from '../../config/baseSetCommand';
import { ConfigParams } from '../../enums/index';
import chalk from 'chalk';
import { icon } from '../../logo';
import { ux } from '@oclif/core';

export default class SetupConfig extends BaseSetCommand<typeof SetupConfig> {
  static summary = 'Vonage CLI configuration wizard';

  static description = `This wizard will setup a config file for the CLI

You can use the command line flags to skip interactive mode`;

  static aliases = ['setup', 'config'];

  public async run(): Promise<void> {
    this.welcome();

    this.debug('Getting API key');
    await this.getNewSetting(ConfigParams.API_KEY);

    this.debug('Getting API secret');
    await this.getNewSetting(ConfigParams.API_SECRET);

    this.debug('Getting private key');
    await this.getNewSetting(ConfigParams.PRIVATE_KEY, ' file');

    this.debug('Getting application id');
    await this.getNewSetting(ConfigParams.APPLICATION_ID);

    const result = this.flags.global
      ? await this.vonageConfig.saveGlobalConfig(this.flags.yes)
      : await this.vonageConfig.saveLocalConfig(this.flags.yes);

    /* istanbul ignore next */
    this.log(
      result
        ? 'Config file saved! ✅'
        : chalk.bold.red('Config file not saved ❌'),
    );
  }

  protected welcome(): void {
    this.log(chalk.rgb(153, 65, 255)(icon.replace(/^ {20}/gm, '')));
    this.log(chalk.bold(`${' '.repeat(20)}Welcome to Vonage!`));
    this.log('');
    this.log(chalk.bold(SetupConfig.description));
    this.log(chalk.dim('Type "vonage config --help" for more information'));
    this.log('');
    this.welcomeFile(
      this.flags.global
        ? this.vonageConfig.globalConfigFile
        : this.vonageConfig.localConfigFile,
    );
    this.log('');
  }

  protected welcomeFile(file: string): void {
    /* istanbul ignore next */
    existsSync(file)
      ? this.log(`The config file: ${file} with be updated`)
      : this.log(`The ${file} with be created`);
  }
}
