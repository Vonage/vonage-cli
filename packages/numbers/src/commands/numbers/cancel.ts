import NumberCommand from '../../number_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default class NumberCancel extends NumberCommand<
    typeof NumberCancel.flags
> {
    static description = 'cancel a Vonage number';

    static examples = [];

    static flags = {
        ...NumberCommand.flags,
    };

    static args: ArgInput = [
        { name: 'number', required: false },
        { name: 'countryCode', required: false },
    ];

    async run() {
        const args = this.parsedArgs!;
        await this.numberBuy({
            number: args.number,
            countryCode: args.countryCode,
        });
        this.log(`Number ${args.number} has been cancelled.`);
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
