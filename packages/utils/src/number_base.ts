import BaseCommand from './command';

export default abstract class NumberCommand extends BaseCommand {

    static flags = {
        ...BaseCommand.flags,
        /* ... */
    };

    static args = [
        ...BaseCommand.args,
        /* ... */
    ];

    get allNumbers(): any {
        return new Promise((res, rej) => {
            this.vonage.number.get({}, (error: any, response: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(response);
                }
            }, true);
        })
    }

    numberBuy(params: { number: string, countryCode: string }): any {
        let { countryCode, number } = params;
        return new Promise((res, rej) => {
            this.vonage.number.buy(countryCode, number, (error: any, response: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(response);
                }
            })
        })
    }

    numberSearch(countryCode: string, options: { type?: string, pattern?: string, search_pattern?: string, features?: [] }): any {
        return new Promise((res, rej) => {
            this.vonage.number.search(
                countryCode,
                options,
                (error: any, response: any) => {
                    if (error) {
                        rej(error);
                    }
                    else {
                        res(response);
                    }
                }
            )
        })
    }

    numberUpdate(number: string, countryCode: string, options: { voiceCallbackType: string, voiceCallbackValue: string, voiceStatusCallback: string, moHttpUrl: string }): any {
        return new Promise((res, rej) => {
            this.vonage.number.update(
                countryCode,
                number,
                options,
                (error: any, response: any) => {
                    if (error) {
                        rej(error);
                    }
                    else {
                        res(response);
                    }
                }
            )
        })
    }

    numberCancel(params: { number: string, countryCode: string }): any {
        let { countryCode, number } = params;
        return new Promise((res, rej) => {
            this.vonage.number.cancel(
                countryCode,
                number,
                (error: any, response: any) => {
                    if (error) {
                        rej(error);
                    }
                    else {
                        res(response);
                    }
                }
            )
        })
    }
}