import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';

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

    try {
      await this.numberBuy(args);
      this.log(`Number ${args.number} has been purchased.`)
    } catch (error) {
      if (error.statusCode === 420) {
        this.log(error.body['error-code-label'])
      }
      this.catch(error);
    }
  }

  async catch(error: any) {
    return super.catch(error);
  }
}
