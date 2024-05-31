import { ConfigParts, ConfigParams, ConfigEnv } from './enums';
import { ConfigData } from './types';
import debug from 'debug';
import { loadConfigFile } from './loader';
import { LatestVersion } from './update';
import { ConfigInterface } from './configInterface';
import { normalize } from 'path';
import { FSFactory } from '@vonage/cli-fs';
import { configFlags } from './configFlags';

const log = debug('@vonage:cli:config');

type ConfigFlags = Record<string, string | undefined>
| Partial<typeof configFlags>;

export class VonageConfig  implements ConfigInterface {
  protected argVars: ConfigData;
  protected envVars: ConfigData;
  protected localConfig: ConfigData;
  protected fs: FSFactory;
  protected globalConfigData: ConfigData;

  public readonly globalConfigFile: string;
  public readonly localConfigFile: string;

  constructor(fs: FSFactory, configDir: string, flags: ConfigFlags) {
    this.fs = fs;
    this.localConfigFile = normalize(`${process.cwd()}/vonage_app.json`);
    this.globalConfigFile = normalize(`${configDir}/vonage.config.json`);

    log(`Vonage local config file ${this.localConfigFile}`);
    log(`Vonage global config file ${this.globalConfigFile}`);

    this.argVars = {
      [ConfigParams.API_KEY]: flags['api-key']
        ? String(flags['api-key'])
        : null,
      [ConfigParams.API_SECRET]: flags['api-secret']
        ? String(flags['api-secret'])
        :  null,
      [ConfigParams.PRIVATE_KEY]: flags['private-key']
        ? String(flags['private-key'])
        :  null,
      [ConfigParams.APPLICATION_ID]: flags['application-id']
        ? String(flags['application-id'])
        : null,
    };
    log('Loaded args values', this.argVars);

    this.envVars = {
      [ConfigParams.API_KEY]: process.env[ConfigEnv.API_KEY]
        ? String(process.env[ConfigEnv.API_KEY])
        : null,
      [ConfigParams.API_SECRET]: process.env[ConfigEnv.API_SECRET]
        ? String(process.env[ConfigEnv.API_SECRET])
        : null,
      [ConfigParams.PRIVATE_KEY]: process.env[ConfigEnv.PRIVATE_KEY]
        ? String(process.env[ConfigEnv.PRIVATE_KEY])
        : null,
      [ConfigParams.APPLICATION_ID]: process.env[ConfigEnv.APPLICATION_ID]
        ? String(process.env[ConfigEnv.APPLICATION_ID])
        :  null,
    };
    log('Loaded env values', this.envVars);

    this.globalConfigData = loadConfigFile(this.fs.loadFile, this.globalConfigFile);
    log('Loaded global values', this.globalConfigData);

    this.localConfig = loadConfigFile(this.fs.loadFile, this.localConfigFile);
    log('Loaded local values', this.localConfig);
  }

  public saveGlobalConfig(): Promise<boolean> {
    return this.fs.saveFile(
      this.globalConfigFile,
      {
        ...this.globalConfigData,
        CONFIG_SCHEMA_VERSION: LatestVersion,
      },
    );
  }

  public saveLocalConfig(): Promise<boolean> {
    return this.fs.saveFile(
      this.localConfigFile,
      {
        ...this.localConfig,
        CONFIG_SCHEMA_VERSION: LatestVersion,
      },
    );
  }

  public getVar(which: ConfigParams): string | null | undefined {
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

  public setVariableFrom(
    which: ConfigParams | string | null,
    from: ConfigParts | string,
    value: string,
  ): void {
    switch (from) {
    case ConfigParts.LOCAL:
      return this.setLocalConfigVar(which as ConfigParams, value);
    case ConfigParts.GLOBAL:
      return this.setConfigVar(which as ConfigParams, value);
      /* istanbul ignore next */
    default:
      throw new Error(`Cannot set ${which} for ${from}`);
    }
  }
  public getVariableFrom(
    which: ConfigParams,
    from: ConfigParts | string,
  ): string | null | undefined {
    switch (from) {
    case ConfigParts.LOCAL:
      return this.localConfig[which];
    case ConfigParts.GLOBAL:
      return this.globalConfigData[which];
    case ConfigParts.ENVIROMENT:
      return this.envVars[which];
    case ConfigParts.ARGUMENTS:
      return this.argVars[which];
    }
  }

  public setLocalConfigVar(which: ConfigParams, value: string): void {
    this.localConfig[which] = value;
  }

  public setConfigVar(which: ConfigParams, value: string): void {
    this.globalConfigData[which] = value;
  }

  public getArgVar(which: ConfigParams): string | null | undefined {
    return this.getVariableFrom(which, ConfigParts.ARGUMENTS);
  }

  public getEnvVar(which: ConfigParams): string | null | undefined {
    return this.getVariableFrom(which, ConfigParts.ENVIROMENT);
  }

  public getLocalConfigVar(which: ConfigParams): string | null | undefined {
    return this.getVariableFrom(which, ConfigParts.LOCAL);
  }

  public getGlobalConfigVar(which: ConfigParams): string | null | undefined {
    return this.getVariableFrom(which, ConfigParts.GLOBAL);
  }
}
