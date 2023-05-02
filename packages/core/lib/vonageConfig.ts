import { ConfigParams, ConfigEnv } from './enums/index';
import { ConfigData } from './types/index';
import debug from 'debug';
import { loadConfigFile } from './config/loader';
import { saveConfigFile } from './config/writer';

const log = debug('vonage:cli:config');

export class VonageConfig {
  protected argVars: ConfigData;
  protected envVars: ConfigData;
  protected localConfig: ConfigData;
  protected globalConfigData: ConfigData;

  public readonly globalConfigFile: string;
  public readonly localConfigFile: string;

  constructor(configDir: string, flags: Record<string, null | string>) {
    this.localConfigFile = `${process.cwd()}/vonage_app.json`;
    this.globalConfigFile = `${configDir}/vonage.config.json`;

    log(`Vonage local config file ${this.localConfigFile}`);
    log(`Vonage config file ${this.globalConfigFile}`);

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

    this.globalConfigData = loadConfigFile(this.globalConfigFile);
    log('Loaded global values', this.globalConfigData);

    this.localConfig = loadConfigFile(this.localConfigFile);
    log('Loaded local values', this.localConfig);
  }

  public saveGlobalConfig(): void {
    saveConfigFile(this.globalConfigFile, this.globalConfigData);
  }
  public saveLocalConfig(): void {
    saveConfigFile(this.localConfigFile, this.localConfig);
  }

  public getVar(which: ConfigParams): string {
    if (this.getArgVar(which)) {
      return this.getArgVar(which);
    }

    if (this.getEnvVar(which)) {
      return this.getEnvVar(which);
    }

    if (this.getLocalConfigVar(which)) {
      return this.getLocalConfigVar(which);
    }

    return this.getGlobalConfigVar(which);
  }

  public setLocalConfigVar(which: ConfigParams, value: string): void {
    this.localConfig[which] = value;
  }

  public setConfigVar(which: ConfigParams, value: string): void {
    this.globalConfigData[which] = value;
  }

  public getArgVar(which: ConfigParams): string {
    return this.argVars[which];
  }

  public getEnvVar(which: ConfigParams): string {
    return this.envVars[which];
  }

  public getLocalConfigVar(which: ConfigParams): string {
    return this?.localConfig[which];
  }

  public getGlobalConfigVar(which: ConfigParams): string {
    return this?.globalConfigData[which];
  }
}
