import {Command, flags} from '@oclif/command'
import {
  deleteSecret204,
  deleteSecret401,
  deleteSecret403,
  deleteSecret404key,
  deleteSecret404secret
} from "../../../../sample/responses";
import cli from "cli-ux";

export default class AccountSecretsDelete extends Command {
  static description = 'revoke a Vonage account secret'

  static examples = [
    `$ vonage account:secrets:delete --id=ad6dc56f-07b5-46e1-a527-85530e625800
204: Success
`,]

  static flags = {
    help: flags.help({char: 'h'}),
    id: flags.string({char: 'i', description: 'The secret id to be revoked.'}),
    confirm: flags.boolean({char: 'c', description: 'bypass confirmation'}),

  }

  async deleteSecrets(id: string | undefined){
    // TODO: Get real values from account
    const statusCode:string = "204"
    switch (statusCode) {
      case "204":
        return {status:statusCode, ...deleteSecret204};
      case "400":
        return {status:statusCode, ...deleteSecret401};
      case "403":
        return {status:statusCode, ...deleteSecret403};
      case "404key":
        return {status:statusCode, ...deleteSecret404key};
      case "404secret":
        return {status:statusCode, ...deleteSecret404secret};
      default:
        return {status:statusCode, ...deleteSecret404secret};
    }
  }

  async run() {
    const {flags} = this.parse(AccountSecretsDelete)
    const confirm = flags.confirm
    let id = flags.id

    if (!id){
        // TODO: list ids and have the user either select from table or enter
        id = await cli.prompt('Enter id to revoke')
    }
    if (!confirm){
      const check = await cli.confirm('Confirm? (y/n)')
      if (!check){
        this.exit()
      }
    }

    const response : any = await this.deleteSecrets(id)
    if (response.status === "204") {
      this.log(`${response.status}: Success`)
    } else {
      this.log(`${response.status}: ${response.title} - ${response.detail}`)
    }
  }
}
