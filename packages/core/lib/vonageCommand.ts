import { Command, Flags, Interfaces } from '@oclif/core';

// eslint-disable-next-line max-len
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof VonageCommand)['baseFlags'] & T['flags']
>

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class VonageCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true;

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'api-key': Flags.string({
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
      dependsOn: ['api-key'],
    }),
    'application-id': Flags.file({
      aliases: ['app-id'],
      summary: 'Application id to use',
      helpGroup: 'GLOBAL',
    }),
  };

  protected flags!: Flags<T>;

  protected args!: Args<T>;

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (this.ctor as typeof VonageCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    console.log('Here');
    // called after run and catch regardless of whether or not the
    // command errored
    return super.finally(_);
  }
}
