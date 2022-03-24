import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default abstract class AppCommand<T extends typeof BaseCommand.flags> extends BaseCommand<T> {
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

    get allApplications(): any {
        return new Promise((res, rej) => {
            this.vonage.applications.get({}, (error: any, response: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(response);
                }
            }, true);
        })
    }

    createApplication(data: object): any {
        return new Promise((res, rej) => {
            this.vonage.applications.create(data, (error: any, response: any) => {
                if (error) {
                    rej(error)
                } else {
                    res(response)
                }
            })
        })
    }

    getSingleApplication(appId: string): any {
        return new Promise((res, rej) => {
            this.vonage.applications.get(appId, (error: any, response: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(response);
                }
            }, true);
        })
    }

    updateApplication(appObj: any): any {
        return new Promise((res, rej) => {
            this.vonage.applications.update(appObj.id, appObj, (error: any, result: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(result);
                }
            });
        })
    }

    deleteApplication(appId: string): any {
        return new Promise((res, rej) => {
            this.vonage.applications.delete(appId, (error: any, result: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(result);
                }
            });
        })
    }

    updateNumber(number: string, countryCode: string, appId?: string): any {
        return new Promise((res, rej) => {
            this.vonage.number.update(
                countryCode,
                number,
                {
                    app_id: appId || null,
                },
                (error: any, result: any) => {
                    if (error) {
                        rej(error);
                    } else {
                        res(result)
                    }
                }
            );
        })
    }

    listNumbers(number?: string): any {
        return new Promise((res, rej) => {
            this.vonage.number.get(
                {
                    pattern: number || '',
                    search_pattern: 1
                },
                (error: any, result: any) => {
                    if (error) {
                        rej(error)
                    } else {
                        res(result)
                    }
                }
            )
        })
    }

}