import { ConfigParts, ConfigParams } from './enums';

export interface ConfigInterface {
  saveGlobalConfig(): Promise<boolean>;

  saveLocalConfig(): Promise<boolean>;

  getVar(which: ConfigParams): string | null | undefined;

  setVariableFrom(
    which: ConfigParams | string | null,
    from: ConfigParts | string,
    value: string,
  ): void;

  getVariableFrom(
    which: ConfigParams,
    from: ConfigParts | string,
  ): string | null | undefined;


  setLocalConfigVar(which: ConfigParams, value: string): void;

  setConfigVar(which: ConfigParams, value: string): void;

  getArgVar(which: ConfigParams): string | null | undefined;

  getEnvVar(which: ConfigParams): string | null | undefined;

  getLocalConfigVar(which: ConfigParams): string | null | undefined;

  getGlobalConfigVar(which: ConfigParams): string | null | undefined;
}
