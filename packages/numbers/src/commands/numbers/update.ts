import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command';

interface webhookFlags {
    url: string
}

export default class NumberUpdate extends NumberCommand {
    static description = 'update a Vonage Number'

    static examples = []

    static flags = {
        ...NumberCommand.flags,
        'url': flags.string({
            description: 'url for mobile inbound webhook',
        }),
    }

    static usage = ['numbers:update NUMBER COUNTRYCODE --url=https://www.example.com']

    static args = [
        { name: 'number', required: true },
        { name: 'countryCode', required: true }
    ]

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof NumberCommand.flags> & webhookFlags;
        const args = this.parsedArgs!;
        await this.numberUpdate(args.number, args.countryCode, { moHttpUrl: flags.url })
        this.log(`"${flags.url}" set for number ${args.number}`);
    }

    async catch(error: any) {
        return super.catch(error);
    }
}