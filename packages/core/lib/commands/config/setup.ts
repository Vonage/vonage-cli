import { existsSync, mkdirSync } from 'fs';
import { parse } from 'path';
import { VonageCommand } from '../../vonageCommand';
import { ux, Flags } from '@oclif/core';
import { ConfigParams } from '../../enums/index';
import chalk from 'chalk';
import { icon } from '../../logo';

export default class Config extends VonageCommand<typeof Config> {
  static summary = 'Vonage configuration wizard';

  static description = `This wizard will setup the global config file for use
  with the Vonage APIs`;

  static enableJsonFlag = false;

  static aliases = ['setup', 'config'];

  static flags = {
    yes: Flags.boolean({
      char: 'y',
      summary: 'Write the config without confirmation',
      allowNo: false,
    }),
  };

  public async run(): Promise<void> {
    this.log(chalk.rgb(153, 65, 255)(icon.replace(/^ {20}/gm, '')));

    this.log(chalk.bold('Welcome to vonage!'));
    this.log('');
    const apiKey = await this.getAPIKey();
    const apiSecret = await this.getAPISecret();
    const privateKey = await this.getPrivateKey();
    const applicationId = await this.getApplicationId();

    this.vonageConfig.setConfigVar(ConfigParams.API_KEY, apiKey);
    this.vonageConfig.setConfigVar(ConfigParams.API_SECRET, apiSecret);
    this.vonageConfig.setConfigVar(ConfigParams.PRIVATE_KEY, privateKey);
    this.vonageConfig.setConfigVar(
      ConfigParams.APPLICATION_ID,
      applicationId,
    );

    await this.writeConfigFile();
  }

  protected async getAPIKey(): Promise<string> {
    const apiKey = this.vonageConfig.getArgVar(ConfigParams.API_KEY);
    return apiKey
      ? apiKey
      : await ux.prompt(`${chalk.bold('API Key')}`, {
        required: true,
        default: this.vonageConfig.getConfigVar(ConfigParams.API_KEY),
      });
  }

  protected async getAPISecret(): Promise<string> {
    const apiSecret = this.vonageConfig.getArgVar(ConfigParams.API_SECRET);
    return apiSecret
      ? apiSecret
      : await ux.prompt(`${chalk.bold('API Secret')}`, {
        required: true,
        default: this.vonageConfig.getConfigVar(
          ConfigParams.API_SECRET,
        ),
      });
  }

  protected async getPrivateKey(): Promise<string> {
    const privateKey = this.vonageConfig.getArgVar(ConfigParams.PRIVATE_KEY);
    return privateKey
      ? privateKey
      : await ux.prompt(`${chalk.bold('Private Key File')}`, {
        required: true,
        default: this.vonageConfig.getConfigVar(
          ConfigParams.PRIVATE_KEY,
        ),
      });
  }

  protected async getApplicationId(): Promise<string> {
    const applicationId = this.vonageConfig.getArgVar(
      ConfigParams.APPLICATION_ID,
    );
    return applicationId
      ? applicationId
      : await ux.prompt(`${chalk.bold('Application Id')}`, {
        required: true,
        default: this.vonageConfig.getConfigVar(
          ConfigParams.APPLICATION_ID,
        ),
      });
  }

  protected async checkConfigDirectory(): Promise<boolean> {
    const { dir: directory } = parse(this.vonageConfig.configFile);
    if (existsSync(directory)) {
      return true;
    }

    const touchDirectory = await ux.confirm(
      `${chalk.bold(`Directory`)} [${directory}] ${chalk.bold(
        `does not exist create?`,
      )} [y/n]`,
    );

    if (!touchDirectory) {
      return false;
    }

    mkdirSync(directory, { recursive: true });
    return true;
  }

  protected async writeConfigFile(): Promise<void> {
    let confirmWrite = true;
    this.log('');
    if (!this.flags.yes) {
      this.outputObject(this.vonageConfig.getConfig());
      confirmWrite = await ux.confirm(
        `${chalk.bold('Confirm settings')} [y/n]`,
      );
    }

    if (!confirmWrite) {
      this.log(chalk.yellow('Not saving configuration'));
      return;
    }

    if (!(await this.checkConfigDirectory())) {
      this.log(chalk.red('Unable to write config file'));
      return;
    }

    this.vonageConfig.saveConfig();
    this.log(
      `${chalk.bold('Config file written to')} ${
        this.vonageConfig.configFile
      }`,
    );
  }
}
