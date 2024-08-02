import { Command, Flags, Interfaces } from '@oclif/core';
import { VonageConfig, ConfigInterface } from './config';
import { commonErrors } from './errorHelp';
import { UXFactory, UXFlags } from './ux';
import { FSFactory } from './fs';

export interface CommandInterface<T extends typeof Command> {
  ux?: UXFactory;

  fs?: FSFactory;

  config?: ConfigInterface;

  run(args?: VonageArgs<T>, flags?: VonageFlags<T>): Promise<void>;
}

export type VonageFlags<T extends typeof Command> = Interfaces.InferredFlags<
  T['flags'] & typeof VonageCommand['baseFlags']
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
      deprecateAliases: true,
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
    ...UXFlags,
  };

  protected errors: Record<string, Array<string>> = {};

  protected args!: VonageArgs<T>;

  protected flags!: VonageFlags<T>;

  protected _vonageConfig?: ConfigInterface;

  protected _ux?: UXFactory;

  protected _fs?: FSFactory;

  abstract get runCommand(): CommandInterface<T>;

  set ux(ux: UXFactory) {
    this._ux = ux;
  }

  get ux(): UXFactory {
    if (!this._ux) {
      this._ux = UXFactory(this.flags);
    }
    return this._ux;
  }

  get fs(): FSFactory {
    if (!this._fs) {
      this._fs = FSFactory(this.flags);
    }
    return this._fs;
  }

  set fs(fs: FSFactory) {
    this._fs = fs;
  }

  get vonageConfig(): ConfigInterface {
    if (!this._vonageConfig) {
      this._vonageConfig = new VonageConfig(
        this.fs,
        this.config.configDir,
        this.flags,
      );
    }

    return this._vonageConfig;
  }

  set vonageConfig(vonageConfig: ConfigInterface) {
    this._vonageConfig = vonageConfig;
  }

  async run(): Promise<void> {
    const command = this.runCommand;
    
    command.ux = this.ux;
    command.fs = this.fs;
    command.config = this.vonageConfig;
    
    await command.run(this.args, this.flags);
  }

  public async init(): Promise<void> {
    await super.init();
    const {args, flags} = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof VonageCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });

    this.flags = flags as VonageFlags<T>;
    this.args = args as VonageArgs<T>;
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<void> {
    const messages = {
      ...commonErrors,
      ...this.errors,
    }[err.constructor.name] || [`An error occurred: ${err.message}`];

    for (const message of messages) {
      this.log(message);
    }

    this.log('');

    this.log('You can set DEBUG=* for more information');
  }
}
