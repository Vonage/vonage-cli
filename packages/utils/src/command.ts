import Command, { flags } from '@oclif/command';
import Vonage from '@vonage/server-sdk';
import { CredentialsObject } from '@vonage/server-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';

export default abstract class extends Command {
    private _vonage!: any;
    private _apiKey!: string
    private _apiSecret!: string
    private _userConfig!: { apiKey: string, apiSecret: string }

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string({ hidden: true, dependsOn: ['apiSecret'] }),
        apiSecret: flags.string({ hidden: true, dependsOn: ['apiKey'] })
    }

    get vonage() {
        if (this._vonage) return this._vonage

        let credentials: CredentialsObject = {
            apiKey: this._apiKey,
            apiSecret: this._apiSecret
        }

        this._vonage = new Vonage(credentials);

        return this._vonage
    }

    get userConfig() {
        return this._userConfig;
    }

    promisify(method: any, data: any) {
        console.log(this.vonage.applications.get({}))
        return new Promise((res, rej) => {
            method.call(data, (error: any, response: any) => {
                if (error) {
                    console.log(error, null, 4)
                    rej(error)
                } else {
                    console.log(error, null, 4)
                    res(response)
                }
            })
        })
    }

    async init() {
        const { flags } = this.parse(Command)
        this._userConfig = await fs.readJSON(path.join(this.config.configDir, 'vonage.config.json'))

        // creds priority order -- flags > env > config
        if (flags?.apiKey && flags?.apiSecret) {
            this._apiKey = flags?.apiKey;
            this._apiSecret = flags?.apiSecret;
        } else if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
            this._apiKey = process.env.VONAGE_API_KEY;
            this._apiSecret = process.env.VONAGE_API_SECRET;
        } else {
            this._apiKey = this._userConfig.apiKey;
            this._apiSecret = this._userConfig.apiSecret;
        }
        console.log(flags)
        console.log(process.env.VONAGE_API_KEY)
        console.log(this._userConfig)

    }


    async catch(error: any) {
        console.log(error)
        if (error.statusCode === 401) {
            console.warn('Authentication Error: Invalid Credentials');
        }

        if (error.oclif?.exit === 0) return;
        return super.catch(error);
    }
}