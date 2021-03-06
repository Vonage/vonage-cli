import { Command, flags } from '@oclif/command';
import { Input, OutputArgs, OutputFlags } from '@oclif/parser';
import Vonage from 'kja-server-sdk';
import { CredentialsObject } from 'kja-server-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';

interface UserConfig {
    apiKey: string,
    apiSecret: string
}

export default abstract class BaseCommand extends Command {
    private _vonage!: any;

    protected _apiKey!: any;
    protected _apiSecret!: any

    protected _userConfig!: UserConfig

    protected parsedArgs?: OutputArgs<any>;
    protected parsedFlags?: OutputFlags<typeof BaseCommand.flags>;

    // add global flags here
    static args = [];

    // add global flags here
    static flags = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string({ hidden: true, dependsOn: ['apiSecret'] }),
        apiSecret: flags.string({ hidden: true, dependsOn: ['apiKey'] })
    }



    get vonage() {
        if (this._vonage) return this._vonage

        let credentials: CredentialsObject = {
            apiKey: this._apiKey || '',
            apiSecret: this._apiSecret || ''
        }

        this._vonage = new Vonage(credentials);

        return this._vonage
    }

    get userConfig() {
        return this._userConfig;
    }

    saveConfig(newConfig: UserConfig): void {
        fs.writeFileSync(path.join(this.config.configDir, 'vonage.config.json'), JSON.stringify(newConfig));
        return;
    }

    async init(): Promise<void> {
        const { args, flags } = this.parse(this.constructor as Input<typeof BaseCommand.flags>);
        this.parsedArgs = args;
        this.parsedFlags = flags;
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
        if (error.statusCode === 401) {
            console.warn('Authentication Error: Invalid Credentials');
            // add direction to use config to set the proper credentials.
        }

        if (error.oclif?.exit === 0) return;
        console.log(error)
        return super.catch(error);
    }
}