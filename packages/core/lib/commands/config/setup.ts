import { existsSync, mkdirSync } from 'fs';
import { parse } from 'path';
import { VonageCommand } from '../../vonageCommand';
import { ux, Flags } from '@oclif/core';
import { ConfigParams } from '../../enums/index';
import chalk from 'chalk';
import { icon } from '../../logo';
import { ConfigData } from '../../types';

export default class Config extends VonageCommand<typeof Config> {
  static summary = 'Vonage CLI configuration wizard';

  static description = `This wizard will setup a config file for the CLI

You can use the command line flags to skip interactive mode`;

  static enableJsonFlag = false;

  static aliases = ['setup', 'config'];

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

  public async run(): Promise<void> {
    this.welcome();
    await this.getAPIKey();
    await this.getAPISecret();
    await this.getPrivateKey();
    await this.getApplicationId();

    if (this.flags.global) {
      await this.writeGlobalConfigFile();
      return;
    }

    await this.writeLocalConfigFile();
  }

  protected welcome(): void {
    this.log(chalk.rgb(153, 65, 255)(icon.replace(/^ {20}/gm, '')));
    this.log(chalk.bold(`${' '.repeat(20)}Welcome to Vonage!`));
    this.log('');
    this.log(chalk.bold(Config.description));
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
    if (existsSync(file)) {
      this.log(`The config file: ${file} with be updated`);
      return;
    }

    this.log(`The ${file} with be created`);
  }

  protected async getAPIKey(): Promise<void> {
    const apiKey = this.vonageConfig.getArgVar(ConfigParams.API_KEY);
    const newApiKey = apiKey
      ? apiKey
      : await ux.prompt(`${chalk.bold('API Key')}`, {
        required: true,
        default: this.flags.global
          ? this.vonageConfig.getGlobalConfigVar(
            ConfigParams.API_KEY,
          )
          : this.vonageConfig.getLocalConfigVar(
            ConfigParams.API_KEY,
          ),
      });

    if (this.flags.global) {
      this.vonageConfig.setConfigVar(ConfigParams.API_KEY, newApiKey);
      return;
    }

    this.vonageConfig.setLocalConfigVar(ConfigParams.API_KEY, newApiKey);
  }

  protected async getAPISecret(): Promise<void> {
    const apiSecret = this.vonageConfig.getArgVar(ConfigParams.API_SECRET);
    const newApiSecret = apiSecret
      ? apiSecret
      : await ux.prompt(`${chalk.bold('API Secret')}`, {
        required: true,
        default: this.flags.global
          ? this.vonageConfig.getGlobalConfigVar(
            ConfigParams.API_SECRET,
          )
          : this.vonageConfig.getLocalConfigVar(
            ConfigParams.API_SECRET,
          ),
      });

    if (this.flags.global) {
      this.vonageConfig.setConfigVar(
        ConfigParams.API_SECRET,
        newApiSecret,
      );
      return;
    }

    this.vonageConfig.setLocalConfigVar(
      ConfigParams.API_SECRET,
      newApiSecret,
    );
  }

  protected async getPrivateKey(): Promise<void> {
    const privateKey = this.vonageConfig.getArgVar(ConfigParams.PRIVATE_KEY);
    const newPrivateKey = privateKey
      ? privateKey
      : await ux.prompt(`${chalk.bold('Private Key File')}`, {
        required: true,
        default: this.flags.global
          ? this.vonageConfig.getGlobalConfigVar(
            ConfigParams.PRIVATE_KEY,
          )
          : this.vonageConfig.getLocalConfigVar(
            ConfigParams.PRIVATE_KEY,
          ),
      });

    if (this.flags.global) {
      this.vonageConfig.setConfigVar(
        ConfigParams.PRIVATE_KEY,
        newPrivateKey,
      );
      return;
    }

    this.vonageConfig.setLocalConfigVar(
      ConfigParams.PRIVATE_KEY,
      newPrivateKey,
    );
  }

  protected async getApplicationId(): Promise<void> {
    const applicationId = this.vonageConfig.getArgVar(
      ConfigParams.APPLICATION_ID,
    );
    const newApplicationId = applicationId
      ? applicationId
      : await ux.prompt(`${chalk.bold('Application Id')}`, {
        required: true,
        default: this.flags.global
          ? this.vonageConfig.getGlobalConfigVar(
            ConfigParams.APPLICATION_ID,
          )
          : this.vonageConfig.getLocalConfigVar(
            ConfigParams.APPLICATION_ID,
          ),
      });

    if (this.flags.global) {
      this.vonageConfig.setConfigVar(
        ConfigParams.APPLICATION_ID,
        newApplicationId,
      );
      return;
    }

    this.vonageConfig.setLocalConfigVar(
      ConfigParams.APPLICATION_ID,
      newApplicationId,
    );
  }

  protected async checkConfigDirectory(file: string): Promise<boolean> {
    const { dir: directory } = parse(file);

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

    this.vonageConfig.saveLocalConfig();
    this.log(`${chalk.bold('Config file written to')} ${file}`);
  }

  protected async writeConfigFile(
    file: string,
    data: ConfigData,
  ): Promise<boolean> {
    let confirmWrite = true;
    this.log('');
    if (!this.flags.yes) {
      this.outputObject(data);
      confirmWrite = await ux.confirm(
        `${chalk.bold('Confirm settings')} [y/n]`,
      );
    }

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
}
