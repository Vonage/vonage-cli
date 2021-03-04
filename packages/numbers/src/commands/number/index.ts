import { NumberCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default class NumberList extends NumberCommand {
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
    // const flags = this.parsedFlags as OutputFlags<typeof NumberList.flags>
    let numberData = await this.allNumbers;
    console.log(numberData)
  }
}
