import BaseCommand from '@vonage/cli-utils';

export default class DisplayBalance extends BaseCommand<typeof DisplayBalance.flags> {
    static description = "display your Vonage account balance"

    static examples = [
        `$vonage balance
Displays your current balance in Euros
`
    ]


    async run() {
        let res = await this.displayBalance();
        this.log(`Current balance: ${res.value.toFixed(2)} EUR`);
        this.exit();
    }
}