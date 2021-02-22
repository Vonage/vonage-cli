import Command from '../../helpers/base'

export default class ApplicationsAssign extends Command {
    static description = 'Assign numbers to Vonage application'

    static examples = []

    static flags = {
        ...Command.flags,
    }

    static args = [
        { name: 'appId', required: false },
        { name: 'number', required: false }
    ]

    async run() {
        const { args, flags }: { args: any, flags: { [index: string]: any } } = this.parse(ApplicationsAssign)

        // if no args provided, present UX
        if (!args.appId && !args.lvn) {
            //get list of applications - select one
            //get list of numbers - select multiple?
        }

        // check for either arg, if any missing, error out
        if (!args.appId || !args.lvn) {
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
