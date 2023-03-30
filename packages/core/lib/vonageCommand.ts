import { Command, Flags, Interfaces } from '@oclif/core';
import { VonageConfig } from './vonageConfig.js';

// Create custom type to allow merging child flags
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
    (typeof VonageCommand)['baseFlags'] & T['flags']
>

// Create custom type to allow merging child arguments
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class VonageCommand<T extends typeof Command> extends Command {
  protected vonageConfig: VonageConfig;

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
    this.vonageConfig = new VonageConfig(this.config.configDir, this.flags);
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the
    // command errored
    return super.finally(_);
  }
}

// ES2022 Transpiling is a bit borked with static memebers
// @see https://github.com/oclif/oclif/issues/1100#issuecomment-1454910926
VonageCommand.enableJsonFlag = true;
VonageCommand.baseFlags = {
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
    dependsOn: ['application-id', 'api-key'],
  }),
  'application-id': Flags.file({
    aliases: ['app-id'],
    summary: 'Application id to use',
    helpGroup: 'GLOBAL',
  }),
};
