import { ux } from '@oclif/core';
import chalk from 'chalk';
import { VonageCommand } from '../../vonageCommand';
import { ConfigParams } from '../../enums/index';
import curry from 'lodash.curry';

export enum ConfigSettings {
    API_KEY = 'api-key',
    API_SECRET = 'api-secret',
    PRIVATE_KEY = 'private-key',
    APPLICATION_ID = 'application-id',
}

const showValue = curry(
  (which, chalk, value) => value[which] || chalk('Not Set'),
);

const yellowChalk = chalk.dim.yellow;

const noChalk = (value) => value;

export default class ShowConfig extends VonageCommand<typeof ShowConfig> {
  static summary = 'Display the current configuration';

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<Array<Record<string, string>>> {
    const { output } = this.flags;
    const chalkToUse = output ? noChalk : yellowChalk;

    const data = [
      {
        name: 'From Arguments',
        ...this.getArgs(),
      },
      {
        name: 'From Environment',
        ...this.getEnv(),
      },
      {
        name: 'From Config File',
        ...this.getConfig(),
      },
      {
        name: 'Derived value',
        ...this.getDerived(),
      },
    ];

    ux.table(
      data,
      {
        name: {
          minWidth: 7,
          extended: true,
        },
        [ConfigParams.API_KEY]: {
          get: showValue(ConfigParams.API_KEY, chalkToUse),
        },
        [ConfigParams.API_SECRET]: {
          get: showValue(ConfigParams.API_SECRET, chalkToUse),
        },
        [ConfigParams.PRIVATE_KEY]: {
          get: showValue(ConfigParams.PRIVATE_KEY, chalkToUse),
        },
        [ConfigParams.APPLICATION_ID]: {
          get: showValue(ConfigParams.APPLICATION_ID, chalkToUse),
        },
      },
      {
        ...this.flags,
        extended: !output ? true : this.flags.extended,
      },
    );

    if (!output) {
      this.log(`Config file located at: ${this.vonageConfig.configFile}`);
    }

    return data;
  }

  protected getDerived(): Record<string, string> {
    return {
      [ConfigParams.API_KEY]: this.vonageConfig.getVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getVar(
        ConfigParams.APPLICATION_ID,
      ),
    };
  }

  protected getConfig(): Record<string, string> {
    return {
      [ConfigParams.API_KEY]: this.vonageConfig.getConfigVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getConfigVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getConfigVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getConfigVar(
        ConfigParams.APPLICATION_ID,
      ),
    };
  }

  protected getEnv(): Record<string, string> {
    return {
      [ConfigParams.API_KEY]: this.vonageConfig.getEnvVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getEnvVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getEnvVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getEnvVar(
        ConfigParams.APPLICATION_ID,
      ),
    };
  }

  protected getArgs(): Record<string, string> {
    return {
      [ConfigParams.API_KEY]: this.vonageConfig.getArgVar(
        ConfigParams.API_KEY,
      ),
      [ConfigParams.API_SECRET]: this.vonageConfig.getArgVar(
        ConfigParams.API_SECRET,
      ),
      [ConfigParams.PRIVATE_KEY]: this.vonageConfig.getArgVar(
        ConfigParams.PRIVATE_KEY,
      ),
      [ConfigParams.APPLICATION_ID]: this.vonageConfig.getArgVar(
        ConfigParams.APPLICATION_ID,
      ),
    };
  }
}
