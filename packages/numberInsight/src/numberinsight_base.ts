import BaseCommand from '@vonage/cli-utils';

export default abstract class NumberInsightCommand extends BaseCommand {

    static flags = {
        ...BaseCommand.flags,
        /* ... */
    };

    static args = [
        ...BaseCommand.args,
        /* ... */
    ];

    getInsights(number, level = 'basic'): any {
        return new Promise((res, rej) => {
            this.vonage.numberInsight.get({ level: level, number: number }, (error: any, result: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(result);
                }
            });
        })
    }
}

