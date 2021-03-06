import { NumberCommand } from 'kja-cli-utils';
import { OutputFlags, OutputArgs } from '@oclif/parser';
// import { flags } from '@oclif/command'

interface buyArgs {
  number: string,
  countryCode: string
}

export default class NumberBuy extends NumberCommand {
  static description = 'manage Vonage numbers'

  static examples = []

  static flags: OutputFlags<typeof NumberCommand.flags> = {
    ...NumberCommand.flags,
  }

  static args: OutputArgs<typeof NumberCommand.args> = [
    { name: 'number', required: false },
    { name: 'countryCode', required: false }
  ]

  async run() {
    // const flags = this.parsedFlags as OutputFlags<typeof NumberBuy.flags>;
    const args = this.parsedArgs! as OutputArgs<typeof NumberBuy.args> & buyArgs;
    let resp = await this.numberBuy(args);
    console.log(resp)
  }
}
