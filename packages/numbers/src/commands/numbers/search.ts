import NumberCommand from '../../number_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { CliUx, Flags } from '@oclif/core';

const cli = CliUx.ux;

// TODO - INTERACTIVE MODE
// Add in ISO look up for Country codes
// var countries = require("i18n-iso-countries");
// console.log(countries.getNames("en", {select: "official"}));

export default class NumberSearch extends NumberCommand<
    typeof NumberSearch.flags
> {
    static description = 'search for available Vonage numbers';

    static examples = [
        `vonage numbers:search US`,
        `vonage numbers:search US --startsWith=1555`,
        `vonage numbers:search US --features=VOICE,SMS --endsWith=1234`,
    ];

    static flags = {
        ...NumberCommand.flags,
        type: Flags.string({
            description: 'Filter by type of number, such as mobile or landline',
            options: ['landline', 'mobile-lvn', 'landline-toll-free'],
        }),
        startsWith: Flags.string({
            description: 'Filter from the start of the phone number.',
            exclusive: ['endsWith', 'contains'],
        }),
        endsWith: Flags.string({
            description: 'Filter from the end of the phone number.',
            exclusive: ['startsWith', 'contains'],
        }),
        contains: Flags.string({
            description: 'Filter from anywhere in the phone number.',
            exclusive: ['endsWith', 'startsWith'],
        }),
        features: Flags.string({
            description:
                // eslint-disable-next-line max-len
                'Available features are SMS, VOICE and MMS. To look for numbers that support multiple features, use a comma-separated value: SMS,MMS,VOICE.',
            options: [
                'SMS',
                'VOICE',
                'SMS,VOICE',
                'MMS',
                'SMS,MMS',
                'VOICE,MMS',
                'SMS,MMS,VOICE',
            ],
        }),
    };

    static args: ArgInput = [{ name: 'countryCode', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;

        const numberData = await this.numberSearch(args.countryCode, flags);
        cli.table(
            numberData.numbers || [],
            {
                country: {},
                msisdn: {
                    header: 'Number',
                },
                type: {},
                cost: {},
                features: {
                    get: (row: any) => row.features.join(','),
                },
            },
            {
                ...flags,
            },
        );
    }

    async catch(error: any) {
        console.log(error);
        return super.catch(error);
    }
}
