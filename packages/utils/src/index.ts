import { Command, flags, } from '@oclif/command';
import { FlagInput, OutputFlags, ParserOutput } from '@oclif/core/lib/interfaces';
import Vonage from '@vonage/server-sdk';
import { CredentialsObject } from '@vonage/server-sdk';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

interface UserConfig {
    apiKey: string,
    apiSecret: string
    apiHost: string
    restHost: string
    videoHost: string
}

export type InferredFlagsType<T> = T extends FlagInput<infer F>
    ? F & {
        json: boolean | undefined;
    }
    : any;


export default abstract class BaseCommand<T extends typeof BaseCommand.flags> extends Command {
    private _vonage!: any;
    protected Vonage!: any;
    protected _apiKey!: any;
    protected _apiSecret!: any
    protected _apiHost!: any
    protected _restHost!: any
    protected _videoHost!: any
    protected _appId!: any
    protected _keyFile!: any
    protected _userConfig!: UserConfig
    protected globalFlags?: OutputFlags<any>;
    protected parsedArgs: { [name: string]: any };
    protected parsedFlags: InferredFlagsType<T>;
    protected parsedOutput?: ParserOutput<any, any>;


    // add global flags here
    static flags = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string({ hidden: true, dependsOn: ['apiSecret'] }),
        apiSecret: flags.string({ hidden: true, dependsOn: ['apiKey'] }),
        apiHost: flags.string({ hidden: true, dependsOn: ['apiHost'] }),
        restHost: flags.string({ hidden: true, dependsOn: ['restHost'] }),
        videoHost: flags.string({ hidden: true, dependsOn: ['videoHost'] }),
        appId: flags.string({ hidden: true, dependsOn: ['keyFile'] }),
        keyFile: flags.string({ hidden: true, dependsOn: ['appId'] }),
        trace: flags.boolean({ hidden: true })
    }

    get vonage() {
        if (this._vonage) return this._vonage

        let credentials: CredentialsObject = {
            apiKey: this._apiKey || '',
            apiSecret: this._apiSecret || ''
        }

        let options = { appendToUserAgent: "vonage-cli" }

        if (this._apiHost) {
            options = { ...options, ...{ apihost: this._apiHost} }
        }

        if (this._restHost) {
            options = { ...options, ...{ restHost: this._restHost} }
        }

        if (this._videoHost) {
            options = { ...options, ...{ videoHost: this._videoHost} }
        }

        console.log(options)
        this._vonage = new Vonage(credentials, options);

        return this._vonage
    }

    get userConfig() {
        return this._userConfig;
    }

    saveConfig(newConfig: UserConfig): void {
        writeFileSync(path.join(this.config.configDir, 'vonage.config.json'), JSON.stringify(newConfig));
        return;
    }

    async displayBalance(): Promise<any> {
        return new Promise((res, rej) => {
            this.vonage.account.checkBalance((error: any, response: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(response);
                }
            });
        })
    }

    async init(): Promise<void> {
        this.parsedOutput = await this.parse(this.ctor);
        this.parsedFlags = this.parsedOutput?.flags ?? {};
        this.parsedArgs = this.parsedOutput?.args ?? {};

        let flags = this.parsedFlags;
        this.globalFlags = { 
            apiKey: flags.apiKey,
            apiSecret: flags.apiSecret,
            apiHost: flags.apiHost,
            restHost: flags.restHost,
            videoHost: flags.videoHost,
            appId: flags.appId,
            keyFile: flags.keyFile,
            trace: flags.trace
        };

        this.Vonage = Vonage;

        //this removes the global flags from the command, so checking for interactive mode is possible.
        delete this.parsedFlags.apiKey
        delete this.parsedFlags.apiSecret
        delete this.parsedFlags.apiHost
        delete this.parsedFlags.restHost
        delete this.parsedFlags.videoHost
        delete this.parsedFlags.trace

        try {
            let rawConfig = readFileSync(path.join(this.config.configDir, 'vonage.config.json'))
            this._userConfig = JSON.parse(rawConfig.toString());
        } catch (error) {
            // need something when no file exists - do we auto create? ask?
        }

        let apiKey, apiSecret, appId, keyFile;

        // creds priority order -- flags > env > config
        // todo - need a better interface for this
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

        if (flags?.appId && flags?.keyFile) {
            appId = flags.appId;
            keyFile = flags.keyFile;
        }

        this._apiKey = apiKey;
        this._apiSecret = apiSecret;
        this._apiHost = this._userConfig.apiHost;
        this._restHost = this._userConfig.restHost;
        this._videoHost = this._userConfig.videoHost;
        this._appId = appId;
        this._keyFile = keyFile;
    }


    async catch(error: any) {

        if (error.oclif?.exit === 0) return;
        if (this.globalFlags?.trace) this.log(error.stack)
        if (error.statusCode === 401) {
            this.error('Authentication Failure', {
                code: 'API_AUTH_ERR',
                suggestions: [
                    "Verify your Api Key and Api Secret with 'vonage config'.",
                ]
            }
            )
        }

        if (error.statusCode === 420 && error.body['error-code-label'] === 'method failed') {
            this.error('Method Failed', {
                code: 'API_MTHD_ERR',
                suggestions: [
                    'Check your inputs are correct.',
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