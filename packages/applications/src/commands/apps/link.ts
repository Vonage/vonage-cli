import { flags } from '@oclif/parser'
import AppCommand from '../../app_base'
import { ArgInput } from '@oclif/core/lib/interfaces';

export default class ApplicationsLink extends AppCommand<typeof ApplicationsLink.flags> {
    static description = 'link numbers to Vonage application'

    static usage = `apps:link [APPID] --number=[NUMBER]`;

    static flags = {
        ...AppCommand.flags,
        number: flags.string({
            description: 'Owned number to be assigned',
            required: true
        }),
    }

    static args: ArgInput = [
        { name: 'appId', required: true },
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!

        const number = await this.listNumbers(flags.number)

        // update the number with appid, lvn, country
        let response = await this.updateNumber(flags.number, number.numbers[0].country, args.appId)

        if (response['error-code'] === '200') {
            this.log(`Number '${flags.number}' is assigned to application '${args.appId}'.`)
        }
    }

    async catch(error: any) {
        return super.catch(error)
    }
}
