import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';


export default class NumberBuy extends NumberCommand {
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
