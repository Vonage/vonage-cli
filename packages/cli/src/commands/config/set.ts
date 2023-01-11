import VonageCommand from '@vonage/cli-utils';
import { Flags } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { writeFileSync } from 'fs';
import * as path from 'path';

export default class ConfigSet
    extends VonageCommand<typeof ConfigSet> {
    static description = 'set Vonage CLI config';

    static flags = {
        apiKey: Flags.string({
            description: 'The new Vonage API Key to set',
        }),
        apiSecret: Flags.string({
            description: 'The new Vonage API Secret to set',
        }),
    };

    static args: ArgInput = [];

    async run() {
        const configFile = path.join(
            this.config.configDir,
            'vonage.config.json',
        );
        const { flags } = await this.parse(ConfigSet);
        this.debug('Flags', flags);
        const newConfig = {
            ...this._userConfig,
            ...flags,
        };
        this.debug(`Writing new config to ${configFile}`, newConfig);
        try {
            writeFileSync(
                configFile,
                JSON.stringify(newConfig),
            );
            this.log('Configuration saved.', newConfig);
        } catch (error) {
            this.debug('Failed to write file');
            this.error(error);
        }
    }
}
