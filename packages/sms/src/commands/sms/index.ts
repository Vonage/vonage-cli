import BaseCommand from '@vonage/cli-utils';
import { request } from '@vonage/vetch';
import { flags, OutputFlags } from '@oclif/parser';

interface SMSFlags {
  to: any,
  from: any,
  message?: any
}

export default class SMSSend extends BaseCommand<typeof SMSSend.flags> {
  static description = 'Send a simple SMS.'

  static examples = [
    `vonage sms --to=15551234567 --from=15551234567 --message='Hello there!'`,
  ]

  static usage = [
    `sms --to=15551234567 --from=15551234567 --message='Hello there!'`,
  ]

  static flags: OutputFlags<typeof BaseCommand.flags> & SMSFlags = {
    ...BaseCommand.flags,
    "to": flags.string({
      required: true
    }),
    from: flags.string({
      required: true
    }),
    message: flags.string({
      default: "Hello from the Vonage CLI!"
    })
  }

  async sendSMS(params) {
    let opts = {};
    opts['url'] = `https://rest.nexmo.com/sms/json`;
    opts['method'] = 'POST'
    delete params.message
    opts['data'] = params
    let response = await request(opts);
    return response;
  }



  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof BaseCommand.flags> & SMSFlags;
    let response = await this.sendSMS({ api_key: this._apiKey, api_secret: this._apiSecret, text: flags.message, ...flags });
    let messages = await JSON.parse(response.data).messages

    if (messages[0].status === '0') {
      this.log("Message sent successfully.")
    } else {
      throw Error(`Message failed with error: ${messages[0]['error-text']}`);
    }

  }

  async catch(error: any) {
    return super.catch(error);
  }

}
