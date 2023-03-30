import term from 'terminal-kit';
import { Flags as OclifFlags, Args } from '@oclif/core';
import { VonageCommand, Flags } from '../../vonageCommand.js';
import { ConfigParams } from '../../enums/index.js';
import compact from 'lodash.compact';

const updateNotSet = (values) =>
  values.map((value) => (value ? value : '^-^yNotSet'));

export default class ListConfig extends VonageCommand<typeof ListConfig> {
  // export default class ShowConfig extends Command {
  static summary = 'Display the current configuration';

  public async run(): Promise<Flags<typeof ListConfig>> {
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

    term.terminal.table(this.selectData(data), {
      hasBorder: true,
      contentHasMarkup: true,
      textAttr: { bgColor: 'default' },
      firstCellTextAttr: { bold: false, bgColor: 'none' },
      firstRowTextAttr: { bold: true },
      firstColumnTextAttr: { bold: true },
      width: 80,
      fit: false,
    });
    this.log(`Config file loacated at: ${this.vonageConfig.configFile}`);
    return this.flags;
  }

  protected selectData(data: Array<Array<string>>): Array<Array<string>> {
    const { which } = this.args;
    return !which
      ? data
      : data.map((value) => [
        value[0],
        ...compact([
          which === 'api-key' ? value[1] : null,
          which === 'api-secret' ? value[2] : null,
          which === 'private-key' ? value[3] : null,
          which === 'application-id' ? value[4] : null,
        ]),
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

  protected show(which: string): boolean {
    const { env, config } = this.flags;

    if (env === null && config === null) {
      return true;
    }

    return !!this.flags[which];
  }
}

ListConfig.flags = {
  config: OclifFlags.boolean({
    summary: 'Show only settings from config file',
    default: null,
  }),
  env: OclifFlags.boolean({
    summary: 'Show only environment settings',
    default: null,
  }),
};

ListConfig.args = {
  which: Args.string({
    summary: 'Show only this value',
    multiple: true,
    options: ['api-key', 'api-secret', 'private-key', 'application-id'],
  }),
};
