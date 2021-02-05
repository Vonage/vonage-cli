/// <reference path="../../node_modules/@vonage/server-sdk/typings/index.d.ts" />
import Command, { flags } from '@oclif/command'
import * as Vonage from '@vonage/server-sdk';

export default abstract class extends Command {
    _vonage!: any

    static flags = {
        help: flags.help({ char: 'h' })
    }

    get vonage() {
        if (this._vonage) return this._vonage

        this._vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY || '',
            apiSecret: process.env.VONAGE_API_SECRET || ''
        })
        return this._vonage
    }

    get allApplications() {
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

    createApplication(data: object) {
        return new Promise((res, rej) => {
            this.vonage.applications.create(data, (error: any, response: any) => {
                if (error) { 
                    console.log(error) 
                } else {
                    res(response)
                }
            })
      })
    }

    getSingleApplication(appId: string) {
        return appId
    }

    deleteApplication(appId: string) {
        return new Promise((res, rej) => {
            this.vonage.applications.delete(appId, (error: any, result: any) => {
                if(error) {
                  rej(error);
                }
                else {
                  res(result);
                }
              });
        })
    }

    async init() {
        // do some initialization
    }
    async catch(err: any) {
        // add any custom logic to handle errors from the command
        // or simply return the parent class error handling
        return super.catch(err);
    }
}