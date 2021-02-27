import Command from '../../helpers/base'

export default class ApplicationsUnlink extends Command {
    static description = 'Remove numbers from Vonage application'

    static examples = []

    static args = [
        { name: 'number', required: false }
    ]

    async run() {
        const { args }: { args: any, flags: { [index: string]: any } } = this.parse(ApplicationsUnlink)

        // get the number details, or error if number doesn't exist
        let number = await this.listNumbers(args.number)

        // update the number with appid, lvn, country
        let response = await this.updateNumber(args.number, number.numbers[0].country);

        if (response['error-code'] === '200') {
            this.log(`Number '${args.number}' has been unassigned.`);
            this.exit()
        }

        this.log(response);
    }

}