import {Command, flags} from '@oclif/command'
import { getSecrets } from "../../../../sample/responses";
import cli from "cli-ux";

export default class AccountSecrets extends Command {
  static description = 'create a Vonage account secret'

  static examples = [
    `$ vonage account:secrets:create
Id                                   Created at
ad6dc56f-07b5-46e1-a527-85530e625800 2017-03-02T16:34:49Z
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
