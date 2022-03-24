import NumberCommand from '../../number_base';
import { Flags } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default class NumberUpdate extends NumberCommand<typeof NumberUpdate.flags> {
    static description = 'update a Vonage Number'

    static examples = []

    static flags = {
        ...NumberCommand.flags,
        'url': Flags.string({
            description: 'url for mobile inbound webhook',
        }),
    }

    static usage = ['numbers:update NUMBER COUNTRYCODE --url=https://www.example.com']

    static args: ArgInput = [
        { name: 'number', required: true },
        { name: 'countryCode', required: true }
    ]

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;
        await this.numberUpdate(args.number, args.countryCode, { moHttpUrl: flags.url })
        this.log(`"${flags.url}" set for number ${args.number}`);
    }

    async catch(error: any) {
        return super.catch(error);
    }
}