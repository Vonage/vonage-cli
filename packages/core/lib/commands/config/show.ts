import term from 'terminal-kit';
import { Flags as OclifFlags, Args } from '@oclif/core';
import { VonageCommand, VonageFlags } from '../../vonageCommand';
import { ConfigParams } from '../../enums/index';

export enum ConfigSettings {
  API_KEY = 'api-key',
  API_SECRET = 'api-secret',
  PRIVATE_KEY = 'private-key',
  APPLICATION_ID = 'application-id'
}

const updateNotSet = (values) =>
  values.map((value) => (value ? value : '^-^yNotSet'));

export default class ShowConfig extends VonageCommand<typeof ShowConfig> {
  static summary = 'Display the current configuration';

  static args = {
    setting: Args.string({
      name: 'setting',
      description: 'Show only this value',
      options: Object.values(ConfigSettings),
    }),
  };

  static flags = {
    config: OclifFlags.boolean({
      summary: 'Show only settings from config file',
    }),
    env: OclifFlags.boolean({
      summary: 'Show only environment settings',
    }),
  };

  public async run(): Promise<VonageFlags<typeof ShowConfig>> {
    const data = [
      [null, 'API Key', 'API Secret', 'Private Key', 'Application id'],
    ];

    if (this.show('args')) {
      data.push(this.getArgs());
    }

    if (this.show('env')) {
      data.push(this.getEnv());
    }

    if (this.show('config')) {
      data.push(this.getConfig());
    }

    if (this.show('derived')) {
      data.push(this.getDerived());
    }

    term.terminal.table(
      this.selectData(data),
      {
        hasBorder: true,
        contentHasMarkup: true,
        textAttr: { bgColor: 'default' },
        firstCellTextAttr: { bold: false, bgColor: 'none' },
        firstRowTextAttr: { bold: true },
        firstColumnTextAttr: { bold: true },
        width: 80,
      },
    );

    //  this.log(`Config file loacated at: ${this.vonageConfig.configFile}`);
    this.log(data.join(' '));
    return this.flags;
  }

  protected selectData(data: Array<Array<string>>): Array<Array<string>> {
    const { setting } = this.args;
    return !setting
      ? data
      : data.map((value) => [
        value[0],
        ...[
          setting === ConfigSettings.API_KEY ? value[1] : null,
          setting === ConfigSettings.API_SECRET ? value[2] : null,
          setting === ConfigSettings.PRIVATE_KEY ? value[3] : null,
          setting === ConfigSettings.APPLICATION_ID ? value[4] : null,
        ].filter((setting) => !!setting),
      ]);
  }

  protected getDerived(): Array<string> {
    return updateNotSet([
      'Derived Value',
      this.vonageConfig.getVar(ConfigParams.API_KEY),
      this.vonageConfig.getVar(ConfigParams.API_SECRET),
      this.vonageConfig.getVar(ConfigParams.PRIVATE_KEY),
      this.vonageConfig.getVar(ConfigParams.APPLICATION_ID),
    ]);
  }

  protected getConfig(): Array<string> {
    return updateNotSet([
      'From Config',
      this.vonageConfig.getConfigVar(ConfigParams.API_KEY),
      this.vonageConfig.getConfigVar(ConfigParams.API_SECRET),
      this.vonageConfig.getConfigVar(ConfigParams.PRIVATE_KEY),
      this.vonageConfig.getConfigVar(ConfigParams.APPLICATION_ID),
    ]);
  }

  protected getEnv(): Array<string> {
    return updateNotSet([
      'From Env',
      this.vonageConfig.getEnvVar(ConfigParams.API_KEY),
      this.vonageConfig.getEnvVar(ConfigParams.API_SECRET),
      this.vonageConfig.getEnvVar(ConfigParams.PRIVATE_KEY),
      this.vonageConfig.getEnvVar(ConfigParams.APPLICATION_ID),
    ]);
  }

  protected getArgs(): Array<string> {
    return updateNotSet([
      'From Args',
      this.vonageConfig.getArgVar(ConfigParams.API_KEY),
      this.vonageConfig.getArgVar(ConfigParams.API_SECRET),
      this.vonageConfig.getArgVar(ConfigParams.PRIVATE_KEY),
      this.vonageConfig.getArgVar(ConfigParams.APPLICATION_ID),
    ]);
  }

  protected show(setting: string): boolean {
    const { env, config } = this.flags;

    if (env === null && config === null) {
      return true;
    }

    return !!this.flags[setting];
  }
}
