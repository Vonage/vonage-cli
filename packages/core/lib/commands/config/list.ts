import { Command } from '@oclif/core';
// import { VonageCommand } from '../../vonageCommand';

// export default class ListConfig extends VonageCommand<typeof ListConfig> {
export default class ListConfig extends Command {
  static summary = 'Display the current configuration';

  public async run(): Promise<void> {
    console.log('I am here');
  }
}
