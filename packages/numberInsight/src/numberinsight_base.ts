import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default abstract class NumberInsightCommand extends BaseCommand {

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
        /* ... */
    };

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

