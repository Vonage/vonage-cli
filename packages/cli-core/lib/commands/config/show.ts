import { readConfigFlags } from '../../configFlags';
import chalk from 'chalk';
import { DisplayedSetting } from '../../enums';
import { ConfigParts, ConfigParams } from '@vonage/cli-config';
import { PathLike } from 'fs';
import {
  CommandInterface,
  VonageFlags,
  VonageArgs,
  VonageCommand,
} from '../../vonageCommand';
import { ConfigInterface } from '@vonage/cli-config';
import { UXFactory } from '@vonage/cli-ux';
import { FSFactory } from '@vonage/cli-fs';

export default class ShowConfig extends VonageCommand<typeof ShowConfig> {
  static summary = 'Display the current configuration';

  static enableJsonFlag = true;

  static flags = {
    ...readConfigFlags,
  };

  get runCommand(): CommandInterface<typeof ShowConfig> {
    return new ShowConfigCommand();
  };
}

export class ShowConfigCommand implements CommandInterface<typeof ShowConfig> {
  ux!: UXFactory;

  fs!: FSFactory;

  config!: ConfigInterface;

  flags!: VonageFlags<typeof ShowConfig>;

  async run(args: VonageArgs<typeof ShowConfig>, flags: VonageFlags<typeof ShowConfig>): Promise<void> {
    this.flags = flags;
    if (this.flags.verbose) {
      this.dumpConfig(ConfigParts.GLOBAL);
      this.dumpConfig(ConfigParts.LOCAL);
      this.dumpConfig(ConfigParts.ENVIROMENT);
      this.dumpConfig(ConfigParts.ARGUMENTS);
    }
    this.dumpConfig();
  };

  protected getSettings() {
    if (!this.flags.setting) {
      return Object.values(ConfigParams);
    }

    return this.flags.setting.map((value) => value.replace('-', '_').toUpperCase());
  }

  protected truncatePrivateKey(privateKey: PathLike | null | string): string | null {
    if (!privateKey) {
      return null;
    }

    return this.fs.pathExists(String(privateKey))
      ? String(privateKey)
      : this.ux.truncateString(String(privateKey));
  }

  protected dumpConfig(from: ConfigParts | null = null): void {
    const { part } = this.flags;
    if (part && !part.includes(from as string)) {
      return;
    }

    const setting = this.getSettings();

    if (setting.includes(ConfigParams.API_KEY)) {
      this.ux.log(this.echoSetting(
        ConfigParams.API_KEY,
        from,
        this.config.getVariableFrom(
          ConfigParams.API_KEY,
            from as string,
        ),
      ));
    }

    if (setting.includes(ConfigParams.API_SECRET)) {
      this.ux.log(this.echoSetting(
        ConfigParams.API_SECRET,
        from,
        this.config.getVariableFrom(
          ConfigParams.API_SECRET,
            from as string,
        ),
      ));
    }

    if (setting.includes(ConfigParams.APPLICATION_ID)) {
      this.ux.log(this.echoSetting(
        ConfigParams.APPLICATION_ID,
        from,
        this.config.getVariableFrom(
          ConfigParams.APPLICATION_ID,
            from as string,
        ),
      ));
    }

    if (setting.includes(ConfigParams.PRIVATE_KEY)) {
      const key = this.config.getVariableFrom(
        ConfigParams.PRIVATE_KEY,
        from as string,
      );
      this.ux.log(this.echoSetting(
        ConfigParams.PRIVATE_KEY,
        from,
        key ? this.truncatePrivateKey(key) : null,
        key !== null,
      ));
    }
    this.ux.log('');
  }

  protected echoSetting(
    setting: ConfigParams,
    part: ConfigParts | null,
    value: string | null | undefined,
    noColor = false,
  ): string {
    return (
      chalk.bold(`The ${part ? `${part} ` : ''}${DisplayedSetting[setting]} is`) +
      ': ' +
      (noColor ? value : this.ux.dumpValue(value))
    );
  }
}
