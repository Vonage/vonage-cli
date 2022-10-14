import { Flags } from '@oclif/core';
import AppCommand from '../../app_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { VonageCliFlags } from '@vonage/cli-utils';

interface AppLinkParams extends VonageCliFlags<typeof ApplicationsLink> {
    number: string
}

export default class ApplicationsLink extends AppCommand<ApplicationsLink> {
    static description = 'link numbers to Vonage application';

    static usage = `apps:link [APPID] --number=[NUMBER]`;

    static flags = {
        number: Flags.string({
            description: 'Owned number to be assigned',
            required: true,
        }),
    };

    static args: ArgInput = [{ name: 'appId', required: true }];

    async run() {
        const { number } = this.flags as AppLinkParams;
        const args = this.parsedArgs ?? {};

        const oldNumber = await this.listNumbers(number as string);

        // update the number with appid, lvn, country
        const response = await this.updateNumber(
            number as string,
            oldNumber?.numbers[0]?.country,
            args.appId,
        );

        if (response['error-code'] === '200') {
            this.log(
                `Number '${number}' is assigned to application '${args.appId}'.`,
            );
        }
    }
}
