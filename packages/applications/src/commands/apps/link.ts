import { flags } from '@oclif/parser';
import AppCommand from '../../app_base';
import { OutputFlags } from '@oclif/parser';
import chalk from 'chalk';

interface LinkFlags {
    number: any
}


export default class ApplicationsLink extends AppCommand {
    static description = 'link numbers to Vonage application'

    static examples = []

    static flags: OutputFlags<typeof AppCommand.flags> & LinkFlags = {
        ...AppCommand.flags,
        number: flags.string({
            description: 'Owned number to be assigned'
        })
    }

    static args = [
        { name: 'appId', required: false }
    ]

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof AppCommand.flags> & LinkFlags;
        const args = this.parsedArgs!

        // if no args provided, present UX
        if (!args.appId && !flags.number) {
            //interactive mode goes here.
        }

        // check for either arg, if any missing, error out
        if (!args.appId) {
            this.error(new Error('Argument \'APPID\' not provided'))
        }

        // get the number details, or error if number doesn't exist
        if (!flags.number) {
            this.error(
                new Error('Flag \'number\' not provided.')
            )
        }

        let number = await this.listNumbers(flags.number);


        // update the number with appid, lvn, country
        let response;

        response = await this.updateNumber(flags.number, number.numbers[0].country, args.appId)

        if (response['error-code'] === '200') {
            this.log(`Number '${args.number}' is assigned to '${args.appId}'.`);
            this.exit()
        }
    }

    async catch(error: any) {
        return super.catch(error);
    }

}
