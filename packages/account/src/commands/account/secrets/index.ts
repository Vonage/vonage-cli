import {Command, flags} from '@oclif/command'
import { getSecrets } from "../../../../sample/responses";
import cli from "cli-ux";

export default class AccountSecrets extends Command {
  static description = 'manage Vonage account secrets'

  static examples = [
    `$ vonage account:secrets
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
    return getSecrets._embedded.secrets
  }

  async run() {
    const {flags} = this.parse(AccountSecrets)
    const accountSecrets = await this.getConfiguration();
    cli.table(accountSecrets, {
      id: {},
      created_at: {},
    }, {})

  }
}
