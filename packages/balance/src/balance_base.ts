import BaseCommand from '@vonage/cli-utils';

export default abstract class BalanceCommand extends BaseCommand {
    static flags = {
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
