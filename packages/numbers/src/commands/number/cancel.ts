import { NumberCommand } from '@vonage/cli-utils';
import { OutputFlags, OutputArgs } from '@oclif/parser';
// import { flags } from '@oclif/command'

interface cancelArgs {
  number: string,
  countryCode: string
}
export default class NumberCancel extends NumberCommand {
  static description = 'cancel a Vonage number'

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
    const args = this.parsedArgs! as OutputArgs<typeof NumberCancel.args> & cancelArgs;
    let resp = await this.numberCancel(args);
    console.log(resp)
  }
}
