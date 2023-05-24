import { Command, Flags, Interfaces } from '@oclif/core';
import { VonageConfig } from './vonageConfig';
import { commonErrors } from './errorHelp';
import * as ux from './ux';
import * as fs from './fs';

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

  protected errors: Record<string, Array<string>>;

  protected vonageConfig: VonageConfig;

  protected flags!: VonageFlags<T>;

  protected args!: VonageArgs<T>;

  protected ux = ux;

  protected fs = fs;

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

  protected async catch(err: Error & { exitCode?: number }): Promise<void> {
    const messages = {
      ...commonErrors,
      ...this.errors,
    }[err.constructor.name] || [`An error occurred: ${err.message}`];

    messages.forEach(
      function (msg: string) {
        this.log(msg);
      }.bind(this),
    );

    this.log('');

    this.log('You can set DEBUG=* for more information');
  }
}
