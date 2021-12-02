import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command';

interface webhookFlags {
    url: any
}

export default class NumberWebhook extends NumberCommand {
    static description = 'add SMS webhook to Vonage Number'

    static examples = []

    static flags: OutputFlags<typeof NumberCommand.flags> & webhookFlags = {
        ...NumberCommand.flags,
        'url': flags.string({
            description: 'url for mobile inbound webhook',
        }),
    }

    static args = [
        { name: 'number', required: false },
        { name: 'countryCode', required: false }
    ]

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof NumberCommand.flags>
        const args = this.parsedArgs!;
        await this.numberUpdate(args.number, args.countryCode, flags.url)
        this.log(`"https://www.example.com" set for number 447700900000`)
    }

    async catch(error: any) {
        return super.catch(error);
    }
}