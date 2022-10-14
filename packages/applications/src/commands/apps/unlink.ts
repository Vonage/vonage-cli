import AppCommand from '../../app_base.js';
import { Flags } from '@oclif/core';
import { VonageCliFlags } from '@vonage/cli-utils';

interface AppUnlinkParams extends VonageCliFlags<typeof ApplicationsUnlink> {
    number: string
}

export default class ApplicationsUnlink
    extends AppCommand<typeof ApplicationsUnlink> {
    static description = 'unlink numbers from Vonage application';

    static examples = [];

    static flags = {
        number: Flags.string({
            description: 'Owned number to be unassigned',
        }),
    };

    async run() {
        const flags = this.parsedFlags as AppUnlinkParams;

        if (!flags.number) {
            this.error(new Error('Flag "number" not provided.'));
        }

        // get the number details, or error if number doesn't exist
        const number = await this.listNumbers(flags.number);

        // update the number with appid, lvn, country
        const response = await this.updateNumber(
            flags.number,
            number.numbers[0].country,
        );

        if (response['error-code'] === '200') {
            this.log(`Number '${flags.number}' has been unassigned.`);
            this.exit();
        }
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
