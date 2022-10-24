import VonageCommand from '@vonage/cli-utils';
import { Flags } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import _ from 'lodash';

export default class ConfigSet
    extends VonageCommand<typeof ConfigSet> {
    static description = 'set Vonage CLI config';

    static flags = {
        apiKey: Flags.string({
            description: 'Vonage API Key',
        }),
        apiSecret: Flags.string({
            description: 'Vonage API Key',
        }),
    };

    static args: ArgInput = [];

    async run() {
        const flags = this.globalFlags;
        // add start, stop process indicators
        this.saveConfig(_.merge({}, this._userConfig, flags));
        this.log('Configuration saved.');
    }
}
