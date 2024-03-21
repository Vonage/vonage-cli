import { Command, Flags, Interfaces } from '@oclif/core';
import {
    OutputFlags,
    ParserOutput,
} from '@oclif/core/lib/interfaces';
import Vonage from '@vonage/server-sdk';
import { CredentialsObject } from '@vonage/server-sdk';
import { readFileSync } from 'fs';
import * as path from 'path';
import chalk from 'chalk';

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserConfig extends ApiConfig{
}

interface ApiConfig {
    apiKey: string;
    apiSecret: string;
}

export type VonageCliFlags<T extends typeof Command> = Interfaces.InferredFlags<
    typeof VonageCommand['globalFlags'] & T['flags']
>

export default abstract class VonageCommand<T extends typeof Command>
    extends Command {
    private _vonage!: any;
    protected Vonage!: any;
    protected _apiKey!: string;
    protected _apiSecret!: string;
    protected _appId!: string;
    protected _keyFile!: string;
    protected _userConfig!: UserConfig;
    protected globalFlags?: OutputFlags<any>;
    protected parsedArgs: { [name: string]: string};
    /**
     * @deprecated
     */
    protected parsedFlags: VonageCliFlags<T>;
    protected parsedOutput?: ParserOutput<any, any>;

    protected flags!: VonageCliFlags<T>;

    // add global flags here
    static globalFlags = {
        apiKey: Flags.string({
            helpGroup: 'Vonage API Flags',
            dependsOn: ['apiSecret'],
        }),
        apiSecret: Flags.string({
            helpGroup: 'Vonage API Flags',
            dependsOn: ['apiKey'],
        }),
        appId: Flags.string({
            helpGroup: 'Vonage Application Flags',
            dependsOn: ['keyFile'],
        }),
        keyFile: Flags.string({
            helpGroup: 'Vonage Application Flags',
            dependsOn: ['appId'],
        }),
        trace: Flags.boolean({
            hidden: true,
        }),
    };

    get vonage() {
        if (this._vonage) {
            return this._vonage;
        }

        const credentials: CredentialsObject = {
            apiKey: this._apiKey || '',
            apiSecret: this._apiSecret || '',
        };

        this._vonage = new Vonage(credentials, {
            appendToUserAgent: 'vonage-cli',
        });

        return this._vonage;
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
        });
    }

    async init(): Promise<void> {
        try {
            await super.init();
            const { flags, args } = await this.parse(
            this.constructor as Interfaces.Command.Class,
            );
            this.flags = this.parsedFlags = flags;
            this.parsedArgs = args;

            this.Vonage = Vonage;

            try {
                const rawConfig = readFileSync(
                    path.join(this.config.configDir, 'vonage.config.json'),
                );
                this._userConfig = JSON.parse(rawConfig.toString());
            } catch (error) {
            // need something when no file exists - do we auto create? ask?
            }

            this.initApiConfig();

            if (flags?.appId && flags?.keyFile) {
                this._appId = flags.appId;
                this._keyFile = flags.keyFile;
            }
        } catch (error) {
            // Fix oclif being too verbose
            this.log(`${chalk.red('>')}    Error: ${error.message}`);
            this.log(`${chalk.red('>')}    See more help with --help`);
            process.exit(2);
        }
    }

    private initApiConfig(): void {
        // Order is Flags -> Env -> Config
        if (this.flags.apiKey && this.flags.apiSecret) {
            this._apiKey = this.flags.apiKey;
            this._apiSecret = this.flags.apiSecret;
            return;
        }

        if (
            process.env.VONAGE_API_KEY
            && process.env.VONAGE_API_SECRET
        ) {
            this._apiKey = process.env.VONAGE_API_KEY;
            this._apiSecret = process.env.VONAGE_API_SECRET;
            return;
        }

        this._apiKey = this._userConfig.apiKey;
        this._apiSecret = this._userConfig.apiSecret;
    }

    async catch(error: any) {
        if (error.statusCode === 401) {
            this.error('Authentication Failure', {
                code: 'API_AUTH_ERR',
                suggestions: [
                    'Verify your Api Key and Api Secret with "vonage config".',
                ],
            });
        }

        if (error.statusCode === 420
            && error.body['error-code-label'] === 'method failed'
        ) {
            this.error('Method Failed', {
                code: 'API_MTHD_ERR',
                suggestions: ['Check your inputs are correct.'],
            });
        }

        return super.catch(error);
    }
}

/**
 * @deprecated Use VonageCommand instead
 */
export abstract class BaseCommand extends VonageCommand<typeof BaseCommand> {

}
