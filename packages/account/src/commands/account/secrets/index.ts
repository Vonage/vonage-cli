import {Command, flags} from '@oclif/command'
import { getSecrets200, getSecrets401, getSecrets404 } from "../../../../sample/responses";
import cli from "cli-ux";

export default class AccountSecrets extends Command {
  static description = 'manage Vonage account secrets'

  static examples = [
    `$ vonage account:secrets
Id                                   Created at
ad6dc56f-07b5-46e1-a527-85530e625800 2017-03-02T16:34:49Z
`,]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async getSecrets(){
    // TODO: Get real values from account
    const statusCode:string = "200"
    switch (statusCode) {
      case "200":
        return { status:statusCode, secrets: getSecrets200._embedded.secrets}
      case "401":
        return  { status:statusCode, ...getSecrets401 }
      case "404":
        return  { status:statusCode, ...getSecrets404 };
      default:
        return  { status:statusCode, ...getSecrets404 };
    }
  }

  async run() {
    const {flags} = this.parse(AccountSecrets)
    const response : any = await this.getSecrets();
    if (response.status === "200"){
      cli.table(response.secrets, {
        id: {},
        created_at: {},
      }, {})
    } else {
      this.log(`${response.status}: ${response.title} - ${response.detail}`)
    }

  }
}
