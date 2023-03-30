import { ConfigParams, ConfigEnv } from './enums/index.js';
import { ConfigData } from './types/index.js';
import { readFileSync, existsSync } from 'fs';
import debug from 'debug';

const log = debug('vonage:cli:config');

export class VonageConfig {
  static CONFIG_SCHEMA_VERSION = '2022-03-30';

  protected argVars: ConfigData;
  protected envVars: ConfigData;
  protected configData: ConfigData;

  public readonly configFile: string;
  protected fileData: Record<string, null | string>;

  constructor(configDir: string, flags: Record<string, null | string>) {
    this.configFile = `${configDir}/vonage.config.json`;
    log(`Vonage config file ${this.configFile}`);
    if (existsSync(this.configFile)) {
      log('Config file exists');
      const fileContents = readFileSync(this.configFile).toString();
      log('Config file contents', fileContents);
      this.fileData = this.configData = fileContents
        ? JSON.parse(fileContents)
        : {};
      log('Loaded config data', this.configData);
    }

    this.argVars = {
      [ConfigParams.API_KEY]: flags['api-key'],
      [ConfigParams.API_SECRET]: flags['api-secret'],
      [ConfigParams.PRIVATE_KEY]: flags['private-key'],
      [ConfigParams.APPLICATION_ID]: flags['application-id'],
    };

    this.envVars = {
      [ConfigParams.API_KEY]: process.env[ConfigEnv.API_KEY],
      [ConfigParams.API_SECRET]: process.env[ConfigEnv.API_SECRET],
      [ConfigParams.PRIVATE_KEY]: process.env[ConfigEnv.PRIVATE_KEY],
      [ConfigParams.APPLICATION_ID]:
                process.env[ConfigEnv.APPLICATION_ID],
    };

    this.updateConfigData();
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

  public getArgVar(which: ConfigParams): string {
    return this.argVars[which];
  }

  public getEnvVar(which: ConfigParams): string {
    return this.envVars[which];
  }

  public getConfigVar(which: ConfigParams): string {
    return this.configData[which];
  }

  public getConfigSchemaVersion(): string {
    return this.configData[ConfigParams.CONFIG_SCHEMA_VERSION];
  }

  protected updateConfigData(): void {
    if (!existsSync(this.configFile)) {
      log('No config file to update');
      return;
    }

    if (
      this.getConfigSchemaVersion() === VonageConfig.CONFIG_SCHEMA_VERSION
    ) {
      log('Config schema is up to date');
      return;
    }

    // TODO break out to account for multiple versions
    this.configData = {
      [ConfigParams.API_KEY]: this.fileData.apiKey,
      [ConfigParams.API_SECRET]: this.fileData.apiSecret,
      [ConfigParams.PRIVATE_KEY]: this.fileData.privateKey,
      [ConfigParams.APPLICATION_ID]: this.fileData.applicationId,
    };
  }
}
