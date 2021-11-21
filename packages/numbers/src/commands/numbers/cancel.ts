import NumberCommand from '../../number_base';
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

  static args = [
    { name: 'number', required: false },
    { name: 'countryCode', required: false }
  ]

  async run() {
    // const flags = this.parsedFlags as OutputFlags<typeof NumberBuy.flags>;
    const args = this.parsedArgs! as cancelArgs;
    let resp = await this.numberCancel(args);
    this.log(`Number ${args.number} has been cancelled.`)
  }

  async catch(error: any) {
    return super.catch(error);
  }
}
