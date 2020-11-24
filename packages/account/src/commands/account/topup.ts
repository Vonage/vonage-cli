import {Command, flags} from '@oclif/command'
import { postTopUp200, postTopUp401auth, postTopUp401auto } from "../../../sample/responses";
import cli from "cli-ux";

export default class AccountTopUp extends Command {
  static description = 'top up Vonage account balance'

  static examples = [
    `$ vonage account:topup --trx=<string>
200: success
`,]

  static flags = {
    help: flags.help({char: 'h'}),
    trx: flags.string({char: 't', description: 'The transaction reference of the transaction when balance was added and auto-reload was enabled on your account.'}),
    confirm: flags.boolean({char: 'c', description: 'bypass confirmation'}),
  }

  async postTopUp(trx:string | undefined) {
    // TODO: Process top up the right way
    const statusCode:string = "200"
    switch (statusCode) {
      case "200":
        return postTopUp200;
      case "401.1":
        return postTopUp401auth;
      case "401.2":
        return postTopUp401auto;
      default:
        return postTopUp401auth;
    }
  }

  async run() {
    const {flags} = this.parse(AccountTopUp)
    const confirm = flags.confirm
    let trx = flags.trx
    let response:any;

    if (!trx) {
      this.log('Note: can be found on the dashboard at https://dashboard.nexmo.com/billing-and-payments/autoreload')
      trx = await cli.prompt('What is the transaction reference?')
    }

    if (!confirm){
      const check = await cli.confirm('Confirm? (y/n)')
      if (!check){
        this.exit()
      }
    }

    response = await this.postTopUp(trx)
    this.log(`${response["error-code"]}: ${response["error-code-label"]}`);
    if (response["error-code"] !== "200"){
      this.log('Note: account can be topped up in the dashboard at https://dashboard.nexmo.com/billing-and-payments/autoreload')
    }
  }
}
