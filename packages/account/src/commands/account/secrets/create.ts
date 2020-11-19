import {Command, flags} from '@oclif/command'
import {
  postSecrets201,
  postSecrets400,
  postSecrets401,
  postSecrets404
} from "../../../../sample/responses";
import cli from "cli-ux";

export default class AccountSecretsCreate extends Command {
  static description = 'create a Vonage account secret'

  static examples = [
    `$ vonage account:secrets:create --secret=example-4PI-secret
Id                                   Created at
ad6dc56f-07b5-46e1-a527-85530e625800 2017-03-02T16:34:49Z
`,]

  static flags = {
    help: flags.help({char: 'h'}),
    secret: flags.string({char: 's', description: 'The new secret must follow these rules:\n' +
        'minimum 8 characters\n' +
        'maximum 25 characters\n' +
        'minimum 1 lower case character\n' +
        'minimum 1 upper case character\n' +
        'minimum 1 digit'}),
  }

  async postSecrets(){
    // TODO: Get real values from account
    const statusCode:string = "201"
    switch (statusCode) {
      case "201":
        return {status:statusCode, ...postSecrets201};
      case "400":
        return {status:statusCode, ...postSecrets400};
      case "401":
        return {status:statusCode, ...postSecrets401};
      case "404":
        return {status:statusCode, ...postSecrets404};
      default:
        return {status:statusCode, ...postSecrets404};
    }
  }

  async validateSecret(secret:string | undefined) {
    const regexCharacters = RegExp('^.{8,25}$');
    const regexLower = RegExp('[a-z]{1,}');
    const regexUpper = RegExp('[A-Z]{1,}');
    const regexDigit = RegExp('[0-9]{1,}');
    return regexCharacters.test(secret) && regexLower.test(secret) && regexUpper.test(secret) && regexDigit.test(secret)
  }

  async run() {
    const {flags} = this.parse(AccountSecretsCreate)
    let secret = flags.secret
    const response : any = await this.postSecrets()
    let valid = false
    if (!secret){
      secret = await cli.prompt('New secret must be:\n' +
        'minimum 8 characters\n' +
        'maximum 25 characters\n' +
        'minimum 1 lower case character\n' +
        'minimum 1 upper case character\n' +
        'minimum 1 digit\n' +
        'New secret')
      valid = await this.validateSecret(secret)
    } else {
      valid = await this.validateSecret(secret)
    }

    if (valid) {
      if (response.status === "201") {
        this.log(`${response.status}: Success id: ${response.id}  created at: ${response.created_at}`)
      } else {
        this.log(`${response.status}: ${response.title} - ${response.detail}`)
      }
    } else {
      this.log(`New secret not valid.`)
    }
  }
}
