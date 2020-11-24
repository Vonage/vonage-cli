import {Command, flags} from '@oclif/command'
import { getBalance, postConfiguration } from "../../../sample/responses";

export default class AccountIndex extends Command {
  static description = 'manage Vonage account'

  static examples = [
    `$ vonage account
Balance                123.45
Inbound Message URL    https://example.com
Delivery Receipts URL  https://example.com
Max Outbound Request   30
Max Inbound Request    30
Max Calls Per Second   30
`,]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async getConfiguration(){
    // TODO: Get real values from account
    return {...getBalance,...postConfiguration}
  }

  async run() {
    const {flags} = this.parse(AccountIndex)
    const accountDetails = await this.getConfiguration();

    this.log(`
Balance                ${accountDetails.value}
Inbound Message URL    ${accountDetails["mo-callback-url"]}
Delivery Receipts URL  ${accountDetails["dr-callback-url"]}
Max Outbound Request   ${accountDetails["max-outbound-request"]}
Max Inbound Request    ${accountDetails["max-inbound-request"]}
Max Calls Per Second   ${accountDetails["max-calls-per-second"]}
    `);
  }
}
