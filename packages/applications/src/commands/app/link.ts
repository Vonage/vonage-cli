import { AppCommand } from '@vonage/cli-utils';

export default class ApplicationsLink extends AppCommand {
    static description = 'link numbers to Vonage application'

    static examples = []

    static args = [
        { name: 'appId', required: false },
        { name: 'number', required: false }
    ]

    async run() {

        const args = this.parsedArgs!;

        // if no args provided, present UX
        if (!args.appId && !args.number) {
            //get list of applications - select one
            //get list of numbers - select multiple?
        }

        // check for either arg, if any missing, error out
        if (!args.appId || !args.number) {
            this.log('Please provide both Application ID and Number')
            this.exit();
        }

        // get the number details, or error if number doesn't exist
        let number = await this.listNumbers(args.number)

        // update the number with appid, lvn, country
        let response = await this.updateNumber(args.number, number.numbers[0].country, args.appId)
        if (response['error-code'] === '200') {
            this.log(`Number '${args.number}' is assigned to '${args.appId}'.`);
            this.exit()
        }
        this.log(response);
    }

    // async catch(error: any) {}
}
