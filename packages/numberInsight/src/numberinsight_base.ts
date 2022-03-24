import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default abstract class NumberInsightCommand<T extends typeof BaseCommand.flags> extends BaseCommand<T>  {
    protected parsedArgs
    protected parsedFlags

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
        /* ... */
    };

    static args: ArgInput = {
        ...BaseCommand.args,
    };

    async catch(error: any) {
        return super.catch(error);
    }

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

