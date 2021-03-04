import { NumberCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default class NumberFind extends NumberCommand {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
  ]

  static flags: OutputFlags<typeof NumberCommand.flags> = {
    ...NumberCommand.flags,
  }

  static args = []

  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof NumberFind.flags>
    console.log(flags)
  }
}