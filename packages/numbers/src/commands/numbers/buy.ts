import NumberCommand from '../../number_base';
import { OutputFlags, OutputArgs } from '@oclif/parser';
// import { flags } from '@oclif/command'

interface buyArgs {
  number: string,
  countryCode: string
}

export default class NumberBuy extends NumberCommand {
  protected parsedArgs: buyArgs;

  static description = 'buy a Vonage number'

  static examples = []

  static flags: OutputFlags<typeof NumberCommand.flags> = {
    ...NumberCommand.flags,
  }

  static args = [
    { name: 'number', required: false },
    { name: 'countryCode', required: false }
  ]

  async run() {
    const args = this.parsedArgs!;
    let resp = await this.numberBuy(args);
    this.log(`Number ${args.number} has been purchased.`)
  }

  async catch(error: any) {
    return super.catch(error);
  }
}
