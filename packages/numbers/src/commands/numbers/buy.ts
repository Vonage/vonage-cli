import NumberCommand from '../../number_base';
import { ArgInput } from '@oclif/core/lib/interfaces';


export default class NumberBuy extends NumberCommand<typeof NumberBuy.flags> {
  static description = 'buy a Vonage number'

  static examples = []

  static flags = {
    ...NumberCommand.flags,
  }

  static args: ArgInput = [
    { name: 'number', required: false },
    { name: 'countryCode', required: false }
  ]

  async run() {
    const args = this.parsedArgs!;
    await this.numberBuy(args);
    this.log(`Number ${args.number} has been purchased.`)
  }

  async catch(error: any) {
    if (error.statusCode === 420 && error.body['error-code-label'] !== "method failed") { // also handle method failed 420 response
      this.error("Address Validation Required", {
        code: "ADDR_VALID",
        suggestions: [error.body['error-code-label']],
      })
    }

    return super.catch(error);
  }
}
