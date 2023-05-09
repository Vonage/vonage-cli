import { Command, Flags, Interfaces } from '@oclif/core';
import { VonageConfig } from './vonageConfig';
import { ConfigEnv } from './enums/index';
import * as ux from './ux';
import chalk from 'chalk';
import {
  MissingApplicationIdError,
  MissingPrivateKeyError,
  InvalidApplicationIdError,
  InvalidPrivateKeyError,
} from '@vonage/jwt';

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
      aliases: ['key_file'],
      deprecateAliases: true,
    }),
    'application-id': Flags.file({
      aliases: ['app-id', 'app_id'],
      summary: 'Application id to use',
      helpGroup: 'GLOBAL',
    }),
    truncate: Flags.boolean({
      summary: 'Truncate long string [when applicable]',
      helpGroup: 'GLOBAL',
      default: true,
      allowNo: true,
    }),
  };

  protected vonageConfig: VonageConfig;

  protected flags!: VonageFlags<T>;

  protected args!: VonageArgs<T>;

  protected ux = ux;

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

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    switch (err.constructor.name) {
    case InvalidPrivateKeyError.name:
      this.log('The private key is invalid!');
      this.log(
        `Check that you have the correcte private key and run this command again`,
      );
      this.log(
        `${chalk.bold(
          'Note:',
        )} The private key can be a path the file or the value of the private key`,
      );
      return;

    case MissingPrivateKeyError.name:
      this.log('You do not have the private key set!');
      this.log(
        `${chalk.bold(
          'Note:',
        )} The private key can be a path the file or the value of the private key`,
      );
      this.log('');
      this.log('To fix this error you can:');
      this.log(
        `1. Run ${chalk.green('vonage config:set private-key <value>')}`,
      );
      this.log(
        `2. Run this command again and Pass in the private key using ${chalk.green(
          '--private-key=<value>',
        )}`,
      );
      this.log(
        `3. Set the ${chalk.green(
          ConfigEnv.PRIVATE_KEY,
        )} environment variable`,
      );
      return;

    case MissingApplicationIdError.name:
      this.log('You do not have an application id set!');
      this.log('');
      this.log('To fix this error you can:');
      this.log(
        `1. Run ${chalk.green('vonage config:set application-id <value>')}`,
      );
      this.log(
        `2. Run this command again and pass in the application id using ${chalk.green(
          '--application-id=<value>',
        )}`,
      );
      this.log(
        `3. Set the ${chalk.green(
          ConfigEnv.APPLICATION_ID,
        )} environment variable`,
      );
      return;

    case InvalidApplicationIdError.name:
      this.log('The application id is invalid!');
      this.log('');
      this.log('Check that you have the correct application id and try again');
      return;

    default:
      this.log('An error occurred!');
      this.log('');
    }

    this.log('You can set DEBUG=* for more information');
    return super.catch(err);
  }
}
