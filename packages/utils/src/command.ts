import { Command, flags } from '@oclif/command';
import { Input, OutputArgs, OutputFlags } from '@oclif/parser';
import { string } from '@oclif/parser/lib/flags';
import Vonage from '@vonage/server-sdk';
import { CredentialsObject, VonageOptions, Message, Media, Number as VNumber, NumberInsight, Verify, Voice } from '@vonage/server-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';

interface UserConfig {
    apiKey: string,
    apiSecret: string
}


interface IClaims {
    application_id: string
    iat?: number,
    jti?: string,
    sub?: string,
    exp?: string,
    acl?: {
        paths?: {
            "/*/users/**"?: any,
            "/*/conversations/**"?: any,
            "/*/sessions/**"?: any,
            "/*/devices/**"?: any,
            "/*/image/**"?: any,
            "/*/media/**"?: any,
            "/*/applications/**"?: any,
            "/*/push/**"?: any,
            "/*/knocking/**"?: any,
            "/*/legs/**"?: any
        }
    },

}


export default abstract class BaseCommand extends Command {
    private _vonage!: any;
    protected Vonage!: any;
    protected _apiKey!: any;
    protected _apiSecret!: any

    protected _userConfig!: UserConfig

    protected parsedArgs?: OutputArgs<any>;
    protected parsedFlags?: OutputFlags<typeof BaseCommand.flags>;
    protected globalFlags?: OutputFlags<any>;

    // add global flags here
    static args = [];

    // add global flags here
    static flags = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string({ hidden: true, dependsOn: ['apiSecret'] }),
        apiSecret: flags.string({ hidden: true, dependsOn: ['apiKey'] }),
        trace: flags.boolean({ hidden: true })
    }

    get vonage() {
        if (this._vonage) return this._vonage

        let credentials: CredentialsObject = {
            apiKey: this._apiKey || '',
            apiSecret: this._apiSecret || ''
        }

        this._vonage = new Vonage(credentials, { appendToUserAgent: "vonage-cli" });

        return this._vonage
    }

    get userConfig() {
        return this._userConfig;
    }

    saveConfig(newConfig: UserConfig): void {
        fs.writeFileSync(path.join(this.config.configDir, 'vonage.config.json'), JSON.stringify(newConfig));
        return;
    }

    // generateJwt(private_key: string, claims: IClaims): string {
    //     // this.Vonage = Vonage
    //     console.log(this.Vonage.generateJwt)
    //     return 'test'
    //     // return this.Vonage.generateJwt(private_key, claims);
    // }

    async init(): Promise<void> {
        const { args, flags } = this.parse(this.constructor as Input<typeof BaseCommand.flags>);

        this.globalFlags = { apiKey: flags.apiKey, apiSecret: flags.apiSecret, trace: flags.trace };
        this.parsedArgs = args;
        this.parsedFlags = flags;
        this.Vonage = Vonage;
        //this removes the global flags from the command, so checking for interactive mode is possible.
        delete this.parsedFlags.apiKey
        delete this.parsedFlags.apiSecret
        delete this.parsedFlags.trace

        this._userConfig = await fs.readJSON(path.join(this.config.configDir, 'vonage.config.json'))
        let apiKey, apiSecret;

        // creds priority order -- flags > env > config
        if (flags?.apiKey && flags?.apiSecret) {
            apiKey = flags.apiKey;
            apiSecret = flags.apiSecret;
        } else if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
            apiKey = process.env.VONAGE_API_KEY;
            apiSecret = process.env.VONAGE_API_SECRET;
        } else {
            apiKey = this._userConfig.apiKey;
            apiSecret = this._userConfig.apiSecret;
        }

        this._apiKey = apiKey;
        this._apiSecret = apiSecret;
    }


    async catch(error: any) {
        if (error.oclif?.exit === 0) return;
        if (this.globalFlags?.trace) this.log(error.stack)
        if (error.statusCode === 401) {
            this.error(
                new Error('Invalid Credentials'),
                {
                    code: 'API_AUTH_ERR',
                    suggestions: [
                        'Check your config credentials are correct - vonage config',
                        'Set your credentials - vonage config:set --apiKey=123 --apiSecret=ABC'
                    ]
                }
            )
        }

        return super.catch(error);
    }

    async finally(error) {
        return super.finally(error);
    }
}