import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import {
  deleteSecret204,
  deleteSecret401,
  deleteSecret403,
  deleteSecret404key,
  deleteSecret404secret, getSecrets200, getSecrets401, getSecrets404
} from "../../../../sample/responses";

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

  async getSecrets(){
    // TODO: Get real values from account
    const statusCode:string = "200"
    switch (statusCode) {
      case "200":
        return { status:statusCode, secrets: getSecrets200._embedded.secrets}
      case "401":
        return { status:statusCode, ...getSecrets401 }
      case "404":
        return { status:statusCode, ...getSecrets404 };
      default:
        return { status:statusCode, ...getSecrets404 };
    }
  }


  async deleteSecret(id: string | undefined){
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
    let secrets: any = [];

    if (!id){
      let ids = await this.getSecrets()
      secrets = ids.secrets?.map(secret => {
        return {name: `${secret.id} - ${secret.created_at}`, value: secret.id, description: secret.created_at}
      })
      // this.log('secrets: ', secrets);
      const response: any = await inquirer.prompt([{
        name: 'id',
        message: 'select a Secret ID',
        type: 'list',
        choices: secrets,
      }])
      id = response.id;
      // this.log('response: ',response)
    }
    if (!confirm){
      const check = await inquirer.prompt([{
        name: 'response',
        message: 'Confirm?',
        type: 'confirm',
        default: false
      }])
      if (!check.response){
        this.exit(0)
      }
    }

    const response : any = await this.deleteSecret(id)
    if (response.status === "204") {
      this.log(`${response.status}: Success`)
    } else {
      this.log(`${response.status}: ${response.title} - ${response.detail}`)
    }
  }

  async catch(error:any) {
    if (error.oclif.exit !== 0){
      this.log(`${error.name}: ${error.message}`)
    }
  }
}
