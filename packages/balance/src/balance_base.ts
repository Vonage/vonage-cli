import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default abstract class BalanceCommand extends BaseCommand {
    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
    };

    static args = [
        ...BaseCommand.args,
    ];

    displayBalance(): any {
        return new Promise((res, rej) => {
            this.vonage.account.checkBalance((error: any, response: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(response);
                }
            });
        })
    }
}
