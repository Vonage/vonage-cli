import { Command, Flags, Interfaces } from '@oclif/core';
import { VonageConfig } from './vonageConfig';
import chalk from 'chalk';

// eslint-disable-next-line max-len
const objectDump = (data: unknown, indent = 2): Array<string> =>
  Object.entries(data)
    .map(([key, value]) => {
      const varType = Array.isArray(value) ? 'array' : typeof value;
      switch (varType) {
      case 'object':
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow(
            '{',
          )}`,
          objectDump(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow('}')}`,
        ];
      case 'array':
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow(
            '[',
          )}`,
          ...dumpArray(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow(']')}`,
        ];
        break;

      default:
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(
          value,
        )}`;
      }
    })
    .flat();

const dumpArray = (data: Array<unknown>, indent = 2) =>
  data.map((value) => {
    const varType = Array.isArray(value) ? 'array' : typeof value;
    switch (varType) {
    case 'object':
      return [
        `${' '.repeat(indent)}${chalk.yellow('{')}`,
        objectDump(value, indent + 2),
        `${' '.repeat(indent)}${chalk.yellow('}')}`,
      ].join('\n');
    case 'array':
      return [
        `${' '.repeat(indent)}${chalk.yellow('[')}`,
        dumpArray(value as Array<unknown>, indent + 2).join('\n'),
        `${' '.repeat(indent)}${chalk.yellow(']')}`,
      ].join('\n');

    default:
      return `${' '.repeat(indent)}${dumpValue(
                    value as string | number,
      )}`;
    }
  });

const dumpValue = (value: string | number): string => {
  switch (typeof value) {
  case 'number':
    return `${chalk.dim(value)}`;
  default:
    return `"${chalk.blue(value)}"`;
  }
};

const dumpKey = (key: string): string => `"${chalk.bold(key)}"`;

export type VonageFlags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof VonageCommand)['baseFlags'] & T['flags']
>

export type VonageArgs<T extends typeof Command> = Interfaces.InferredArgs<
    T['args']
>

export abstract class VonageCommand<T extends typeof Command> extends Command {
  static enableJsonFlag = true;
  static baseFlags = {
    'api-key': Flags.string({
      aliases: ['apiKey'],
      summary: 'API Key to use',
      helpGroup: 'GLOBAL',
    }),
    'api-secret': Flags.string({
      summary: 'API Secret to use',
      helpGroup: 'GLOBAL',
      dependsOn: ['api-key'],
    }),
    'private-key': Flags.file({
      summary: 'Private key file to use',
      helpGroup: 'GLOBAL',
      dependsOn: ['application-id', 'api-key'],
    }),
    'application-id': Flags.file({
      aliases: ['app-id'],
      summary: 'Application id to use',
      helpGroup: 'GLOBAL',
    }),
  };

  protected vonageConfig: VonageConfig;

  protected flags!: VonageFlags<T>;

  protected args!: VonageArgs<T>;

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (this.ctor as typeof VonageCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.flags = flags as VonageFlags<T>;
    this.args = args as VonageArgs<T>;
    this.vonageConfig = new VonageConfig(this.config.configDir, this.flags);
  }

  public outputObject(data: unknown): void {
    console.log(
      [
        chalk.yellow('{'),
        ...objectDump(data).flat(),
        chalk.yellow('}'),
      ].join('\n'),
    );
  }
}
