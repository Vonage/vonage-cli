import Command from '../../helpers/base'

export default class ApplicationsAssign extends Command {
    static description = 'Assign numbers to Vonage application'

    static examples = []

    static flags = {
        ...Command.flags,
    }

    static args = [
        { name: 'appId', required: false },
        { name: 'lvn', required: false }
    ]

    async run() {
        const { args, flags }: { args: any, flags: { [index: string]: any } } = this.parse(ApplicationsAssign)

        // get the number details, or error if number doesn't exist
        let number = await this.listNumbers(args.lvn)

        // update the number with appid, lvn, country
        let response = await this.updateNumber(args.lvn, number.numbers[0].country, args.appId)
        if (response['error-code'] === '200') {
            this.log(`Number '${args.lvn}' is assigned to '${args.appId}'.`);
            this.exit()
        }
        this.log(response);
    }

    // async catch(error: any) {}
}
