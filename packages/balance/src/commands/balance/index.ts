import { OutputFlags } from '@oclif/parser';
import BalanceCommand from '../../balance_base';

export default class DisplayBalance extends BalanceCommand {
    static description = "display your Vonage account balance"

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
        this.log(`Current balance: ${res.value.toFixed(2)} EUR`);
        this.exit();
    }
}