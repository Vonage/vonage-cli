/// <reference path="../../node_modules/@vonage/server-sdk/typings/index.d.ts" />
import Command, { flags } from '@oclif/command'
import * as Vonage from '@vonage/server-sdk';
import parsePhoneNumber from 'libphonenumber-js'


export default abstract class extends Command {
    _vonage!: any

    static flags = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string({hidden:true}),
        apiSecret: flags.string({hidden:true})
    }

    get vonage() {
        if (this._vonage) return this._vonage
        this._vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY || '',
            apiSecret: process.env.VONAGE_API_SECRET || ''
        })

        return this._vonage
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
                    // console.dir(error, {depth: 5})
                    rej(error)
                } else {
                    // console.log(response)
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

    updateApplication(appId: string): any {
        return appId
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

    updateNumber(lvn: string, cc: string, appId?: string): any {
        return new Promise((res,rej) => {
            this.vonage.number.update(
                cc,
                lvn,
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
    
    listNumbers(lvn?: string): any {
        return new Promise((res, rej) => {
            this.vonage.number.get(
                {
                    pattern: lvn || '',
                    search_pattern: 1
                },
                (error, result) => {
                  if (error) {
                    rej(error)
                  } else {
                      res(result)
                  }
                }
            )
        })
    }

    async init() {
        return super.init()
    }


    async catch(error: any) {

        if (error.statusCode === 401) {
            console.warn('Authentication Error: Invalid Credentials');
        } 

        if (error.oclif?.exit === 0) return;

        return super.catch(error);
    }
}