import {
  ConfigInterface,
  ConfigData,
  ConfigParams,
  ConfigParts
} from '@vonage/cli-config';

export class MockVonageConfig implements ConfigInterface {
  protected configData: ConfigData;

  constructor(configData: ConfigData) {
    this.configData = configData;
  }


  saveGlobalConfig(): Promise<boolean> {
    return Promise.resolve(true);
  }

  saveLocalConfig(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getVar(which: ConfigParams): string | null | undefined {
    return this.configData[which];
  }

  setVariableFrom(
    which: ConfigParams | string | null,
    from: ConfigParts | string,
    value: string,
  ): void {
    switch (from) {
    case ConfigParts.LOCAL:
      return this.setLocalConfigVar(which as ConfigParams, value);
    case ConfigParts.GLOBAL:
      return this.setConfigVar(which as ConfigParams, value);
    default:
      throw new Error(`Cannot set ${which} for ${from}`);
    }
  };

  getVariableFrom(
    which: ConfigParams,
    from: ConfigParts | string,
  ): string | null | undefined {
    switch (from) {
    case ConfigParts.LOCAL:
      return this.configData[which];
    case ConfigParts.GLOBAL:
      return this.configData[which];
    case ConfigParts.ENVIROMENT:
      return this.configData[which];
    case ConfigParts.ARGUMENTS:
      return this.configData[which];
    }
  }

  setLocalConfigVar(which: ConfigParams, value: string): void {
    this.configData[which] = value;
  }

  setConfigVar(which: ConfigParams, value: string): void {
    this.configData[which] = value;
  }

  getArgVar(which: ConfigParams): string | null | undefined {
    return this.configData[which];
  }

  getEnvVar(which: ConfigParams): string | null | undefined {
    return this.configData[which];
  }

  getLocalConfigVar(which: ConfigParams): string | null | undefined {

    return this.configData[which];
  }

  getGlobalConfigVar(which: ConfigParams): string | null | undefined {

    return this.configData[which];
  }
}
