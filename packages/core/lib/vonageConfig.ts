import { ConfigParts, ConfigParams, ConfigEnv } from './enums/index';
import { ConfigData } from './types/index';
import debug from 'debug';
import { loadConfigFile } from './config/loader';
import { saveFile } from './fs';
import { LatestVersion } from './config/update';

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
      [ConfigParams.APPLICATION_ID]: process.env[ConfigEnv.APPLICATION_ID],
    };
    log('Loaded env values', this.envVars);

    this.globalConfigData = loadConfigFile(this.globalConfigFile);
    log('Loaded global values', this.globalConfigData);

    this.localConfig = loadConfigFile(this.localConfigFile);
    log('Loaded local values', this.localConfig);
  }

  public saveGlobalConfig(force = false): Promise<boolean> {
    return saveFile(
      this.globalConfigFile,
      {
        ...this.globalConfigData,
        CONFIG_SCHEMA_VERSION: LatestVersion,
      },
      force,
    );
  }

  public saveLocalConfig(force = false): Promise<boolean> {
    return saveFile(
      this.localConfigFile,
      {
        ...this.localConfig,
        CONFIG_SCHEMA_VERSION: LatestVersion,
      },
      force,
    );
  }

  public getVar(which: ConfigParams | string): string {
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

  public getVariableFrom(
    which: ConfigParams | string | null,
    from: ConfigParts | string,
  ): string {
    switch (from) {
    case ConfigParts.LOCAL:
      return this.localConfig[which];
    case ConfigParts.GLOBAL:
      return this.globalConfigData[which];
    case ConfigParts.ENVIROMENT:
      return this.envVars[which];
    case ConfigParts.ARGUMENTS:
      return this.argVars[which];
    default:
      return this.getVar(which);
    }
  }

  public setLocalConfigVar(which: ConfigParams, value: string): void {
    this.localConfig[which] = value;
  }

  public setConfigVar(which: ConfigParams, value: string): void {
    this.globalConfigData[which] = value;
  }

  public getArgVar(which: ConfigParams | string): string {
    return this.getVariableFrom(which, ConfigParts.ARGUMENTS);
  }

  public getEnvVar(which: ConfigParams | string): string {
    return this.getVariableFrom(which, ConfigParts.ENVIROMENT);
  }

  public getLocalConfigVar(which: ConfigParams | string): string {
    return this.getVariableFrom(which, ConfigParts.LOCAL);
  }

  public getGlobalConfigVar(which: ConfigParams | string): string {
    return this.getVariableFrom(which, ConfigParts.GLOBAL);
  }
}
