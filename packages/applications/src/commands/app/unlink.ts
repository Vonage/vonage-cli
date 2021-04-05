import { AppCommand } from '@vonage/cli-utils';
import { flags } from '@oclif/parser';
import { OutputFlags } from '@oclif/parser';

interface UnLinkFlags {
    number: any
}

export default class ApplicationsUnlink extends AppCommand {
    static description = 'unlink numbers from Vonage application'

    static examples = []

    static flags: OutputFlags<typeof AppCommand.flags> & UnLinkFlags = {
        ...AppCommand.flags,
        number: flags.string({
            description: 'Owned number to be unassigned'
        })
    }

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof AppCommand.flags> & UnLinkFlags;

        if (!flags.number) {
            this.error(
                new Error('Flag \'number\' not provided.')
            )
        }

        // get the number details, or error if number doesn't exist
        let number = await this.listNumbers(flags.number);

        // update the number with appid, lvn, country
        let response = await this.updateNumber(flags.number, number.numbers[0].country);

        if (response['error-code'] === '200') {
            this.log(`Number '${flags.number}' has been unassigned.`);
            this.exit()
        }

    }

}