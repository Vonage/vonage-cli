import BaseCommand from '@vonage/cli-utils';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { OutputFlags } from '@oclif/parser';

export default abstract class NumberCommand<T extends typeof BaseCommand.flags> extends BaseCommand<T> {
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

    protected _parseParams(params): any {
        let searchResponse = {}
        if (params.startsWith) {
            searchResponse['pattern'] = params.startsWith;
            searchResponse['search_pattern'] = 0
            delete params.startsWith
        }
        if (params.endsWith) {
            searchResponse['pattern'] = params.endsWith;
            searchResponse['search_pattern'] = 2
            delete params.endsWith
        }
        if (params.contains) {
            searchResponse['pattern'] = params.contains;
            searchResponse['search_pattern'] = 1
            delete params.contains
        }
        return Object.assign({}, params, searchResponse)
    }


    getAllNumbers(params): any {
        return new Promise((res, rej) => {
            this.vonage.number.get(params, (error: any, response: any) => {
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

    numberSearch(countryCode: string, options): any {
        return new Promise((res, rej) => {
            this.vonage.number.search(
                countryCode,
                this._parseParams(options),
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

    numberUpdate(number: string, countryCode: string, options: { voiceCallbackType?: string, voiceCallbackValue?: string, voiceStatusCallback?: string, moHttpUrl?: string }): any {
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