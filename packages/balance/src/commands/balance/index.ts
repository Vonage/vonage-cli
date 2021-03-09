import { OutputFlags } from '@oclif/parser';
import { BalanceCommand } from '@vonage/cli-utils';

export default class DisplayBalance extends BalanceCommand {
    static description = "Display your account balance"

    static examples = [
        `$vonage balance
Displays your current balance in Euros
`
    ]

    static flags: OutputFlags<typeof BalanceCommand.flags> = {
        ...BalanceCommand.flags
    }

    async run() {
        let res = await this.displayBalance();
        console.log(`Current balance: ${res.value.toFixed(2)} EUR`);
        this.exit();
    }
}