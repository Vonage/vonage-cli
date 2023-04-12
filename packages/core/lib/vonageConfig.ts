import { ConfigParams, ConfigEnv } from './enums/index';
import { ConfigData } from './types/index';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import debug from 'debug';

const log = debug('vonage:cli:config');

export class VonageConfig {
  static CONFIG_SCHEMA_VERSION = '2022-03-30';

  protected argVars: ConfigData;
  protected envVars: ConfigData;
  protected configData: ConfigData;

  public readonly configFile: string;
  protected readonly fileData: Record<string, null | string>;

  constructor(configDir: string, flags: Record<string, null | string>) {
    this.configFile = `${configDir}/vonage.config.json`;
    log(`Vonage config file ${this.configFile}`);
    this.fileData = {};
    if (existsSync(this.configFile)) {
      log('Config file exists');
      const fileContents = readFileSync(this.configFile).toString();
      log('Config file contents', fileContents);
      this.fileData = this.configData = fileContents
        ? JSON.parse(fileContents)
        : {};
      log('Loaded config from file', this.configData);
    }

    this.argVars = {
      [ConfigParams.API_KEY]: flags['api-key'],
      [ConfigParams.API_SECRET]: flags['api-secret'],
      [ConfigParams.PRIVATE_KEY]: flags['private-key'],
      [ConfigParams.APPLICATION_ID]: flags['application-id'],
    };

    log('Loaded args values', this.argVars);
    this.envVars = {
      [ConfigParams.API_KEY]: process.env[ConfigEnv.API_KEY],
      [ConfigParams.API_SECRET]: process.env[ConfigEnv.API_SECRET],
      [ConfigParams.PRIVATE_KEY]: process.env[ConfigEnv.PRIVATE_KEY],
      [ConfigParams.APPLICATION_ID]:
                process.env[ConfigEnv.APPLICATION_ID],
    };

    log('Loaded env values', this.envVars);
    this.configData = {
      [ConfigParams.API_KEY]: this.fileData[ConfigParams.API_KEY],
      [ConfigParams.API_SECRET]: this.fileData[ConfigParams.API_SECRET],
      [ConfigParams.PRIVATE_KEY]: this.fileData[ConfigParams.PRIVATE_KEY],
      [ConfigParams.APPLICATION_ID]:
                this.fileData[ConfigParams.APPLICATION_ID],
    };
    log('Config file data', this.configData);
    this.updateConfigData();
    log('Updated config data', this.configData);
  }

  public getConfig(): Record<string, string> {
    return this.configData;
  }

  public saveConfig(): void {
    const configData = {
      ...this.configData,
      [ConfigParams.CONFIG_SCHEMA_VERSION]:
                VonageConfig.CONFIG_SCHEMA_VERSION,
    };
    log(`Saiving config ${this.configFile}`);
    log(configData);
    writeFileSync(this.configFile, JSON.stringify(configData, null, 2));
    log(`Config file written`);
  }

  public getVar(which: ConfigParams): string {
    if (this.getArgVar(which)) {
      return this.getArgVar(which);
    }

    if (this.getEnvVar(which)) {
      return this.getEnvVar(which);
    }

    return this.getConfigVar(which);
  }

  public setConfigVar(which: ConfigParams, value: string): void {
    this.configData[which] = value;
  }

  public getArgVar(which: ConfigParams): string {
    return this.argVars[which];
  }

  public getEnvVar(which: ConfigParams): string {
    return this.envVars[which];
  }

  public getConfigVar(which: ConfigParams): string {
    return this?.configData[which];
  }

  public getConfigFileSchemaVersion(): string {
    return this.fileData[ConfigParams.CONFIG_SCHEMA_VERSION];
  }

  protected updateConfigData(): void {
    if (!existsSync(this.configFile)) {
      log('No config file to update');
      return;
    }

    log(`Config schema is ${this.getConfigFileSchemaVersion()}`);
    if (
      this.getConfigFileSchemaVersion()
            === VonageConfig.CONFIG_SCHEMA_VERSION
    ) {
      log('Config schema is up to date');
      return;
    }

    log('Updating config schema [in memory only]');

    // TODO break out in to own function to account for multiple config versions
    this.configData = {
      [ConfigParams.API_KEY]: this.fileData.apiKey,
      [ConfigParams.API_SECRET]: this.fileData.apiSecret,
      [ConfigParams.PRIVATE_KEY]: this.fileData.privateKey,
      [ConfigParams.APPLICATION_ID]: this.fileData.applicationId,
    };
  }
}
