import {Command, flags} from '@oclif/command'
import { postConfiguration } from "../../../sample/responses";
import * as inquirer from 'inquirer'

export default class AccountConfig extends Command {
  static description = 'configure Vonage account'

  static examples = [
    `$ vonage account:config --inbound-message-url=<string> --delivery-receipt-url=<string>
200 OK. Settings updated.
Inbound Message URL    https://example.com
Delivery Receipts URL  https://example.com
Max Outbound Request   30
Max Inbound Request    30
Max Calls Per Second   30
`,]

  static flags = {
    help: flags.help({char: 'h'}),
    "inbound-message-url": flags.string({char: 'i', description: 'webhook URL for incoming SMS messages, pass "" to unset or leave blank to not change'}),
    "delivery-receipt-url": flags.string({char: 'd', description: 'webhook URL for delivery receipt, pass "" to unset or leave blank to not change'}),
    confirm: flags.boolean({char: 'c', description: 'bypass confirmation'}),
  }

  async getConfiguration(){
    return postConfiguration;
  }

  async updateConfiguration(inbound:string | undefined,delivery:string | undefined) {
    // TODO: Update configuration the right way
    const statusCode:number = 200
    let configuration:object = {}
    if (statusCode === 200){
      configuration = {
        ...postConfiguration,
        "mo-callback-url": ( inbound !== 'unchanged' && inbound !== undefined ) ? inbound : postConfiguration["mo-callback-url"],
        "dr-callback-url": ( delivery !== 'unchanged' && delivery !== undefined ) ? delivery : postConfiguration["dr-callback-url"],
      }
    }
    return {statusCode, ...configuration};
  }

  async run() {
    const {flags} = this.parse(AccountConfig)
    let confirm = flags.confirm
    let inbound = flags["inbound-message-url"]
    let delivery = flags["delivery-receipt-url"]
    let response:any;

    const currentConfiguration = await this.getConfiguration()

    if(!inbound){
      const response: any = await inquirer.prompt([{
        name: 'incoming',
        message: 'webhook URL for incoming SMS messages, pass ""(empty string) to unset',
        type: 'input',
        default: currentConfiguration["mo-callback-url"],
      }])
      inbound = response.incoming
      this.log('inbound: ',inbound)
    }

    if(!delivery){
      const response: any = await inquirer.prompt([{
        name: 'delivery',
        message: 'webhook URL for delivery receipt, pass ""(empty string) to unset',
        type: 'input',
        default: currentConfiguration["dr-callback-url"],
      }])
      delivery = response.delivery
      this.log('inbound: ',delivery)
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


    response = await this.updateConfiguration(inbound,delivery)

    if (response.statusCode === 200){
      this.log(`
${response.statusCode} OK. Settings updated.
Inbound Message URL    ${response["mo-callback-url"]}
Delivery Receipts URL  ${response["dr-callback-url"]}
Max Outbound Request   ${response["max-outbound-request"]}
Max Inbound Request    ${response["max-inbound-request"]}
Max Calls Per Second   ${response["max-calls-per-second"]}
      `);
    } else {
      this.log(`${response.statusCode} Error updating configuration.`);
    }
  }

  async catch(error:any) {
    if (error.oclif.exit !== 0){
      this.log(`${error.name}: ${error.message}`)
    }
  }

}
