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
        // {
        //     pattern: NUMBER_SEARCH_CRITERIA,
        //     search_pattern: NUMBER_SEARCH_PATTERN
        //   }
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

    numberBuy(number: string): any {
        let countryCode = ''
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

    numberSearch(number: string): any {
        let countryCode = ''
        // {
        //     type: VONAGE_NUMBER_TYPE,
        //     pattern: NUMBER_SEARCH_CRITERIA,
        //     search_pattern: NUMBER_SEARCH_PATTERN,
        //     features: VONAGE_NUMBER_FEATURES
        // }
        return new Promise((res, rej) => {
            this.vonage.number.search(
                countryCode,
                {},
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

    numberUpdate(number: string): any {
        let countryCode = ''
        // {
        //     messagesCallbackType: 'app',
        //     messagesCallbackValue: VONAGE_APPLICATION_ID,
        //     voiceCallbackType: VOICE_CALLBACK_TYPE,
        //     voiceCallbackValue: VOICE_CALLBACK_VALUE,
        //     voiceStatusCallback: VOICE_STATUS_URL,
        //     moHttpUrl: SMS_CALLBACK_URL,
        // }
        return new Promise((res, rej) => {
            this.vonage.number.update(
                countryCode,
                number,
                {},
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

    numberCancel(number: string): any {
        let countryCode = ''

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