import VonageCommand from '@vonage/cli-utils';

export default class DisplayBalance
    extends VonageCommand<typeof DisplayBalance> {
    static description = 'display your Vonage account balance';

    static examples = [
        `$vonage balance
Displays your current balance in Euros
`,
    ];

    async run() {
        const res = await this.displayBalance();
        this.log(`Current balance: ${res.value.toFixed(2)} EUR`);
        this.exit();
    }
}
