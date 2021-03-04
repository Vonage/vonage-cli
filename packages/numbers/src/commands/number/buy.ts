import { NumberCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default class NumberBuy extends NumberCommand {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
  ]

  static flags: OutputFlags<typeof NumberCommand.flags> = {
    ...NumberCommand.flags,
  }

  static args = [
    { name: 'number', required: false }
  ]

  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof NumberBuy.flags>
    console.log(flags)
  }
}
