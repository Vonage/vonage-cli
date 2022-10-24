import VonageCommand from '@vonage/cli-utils';
import { request } from '@vonage/vetch';
import { Flags } from '@oclif/core';

export default class SMSSend extends VonageCommand<typeof SMSSend> {
    static description = 'Send a simple SMS.';

    static examples = [
        `vonage sms --to=15551234567 --from=15551234567 --message='Hello there!'`,
    ];

    static usage = [
        `sms --to=15551234567 --from=15551234567 --message='Hello there!'`,
    ];

    static flags = {
        to: Flags.string({
            required: true,
        }),
        from: Flags.string({
            required: true,
        }), message: Flags.string({
            default: 'Hello from the Vonage CLI!',
        }),
    };

    async sendSMS(params) {
        const opts = {};
        opts['url'] = `https://rest.nexmo.com/sms/json`;
        opts['method'] = 'POST';
        delete params.message;
        opts['data'] = params;
        const response = await request(opts);
        return response;
    }

    async run() {
        const response = await this.sendSMS({
            api_key: this._apiKey,
            api_secret: this._apiSecret,
            text: this.flags.message,
            ...this.flags,
        });
        const messages = await response.data.messages;

        if (messages[0].status === '0') {
            this.log('Message sent successfully.');
        } else {
            throw Error(
                `Message failed with error: ${messages[0]['error-text']}`,
            );
        }
    }
}
