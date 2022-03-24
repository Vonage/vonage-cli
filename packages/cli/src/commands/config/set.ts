import BaseCommand from '@vonage/cli-utils';
import { flags } from '@oclif/command';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { merge } from 'lodash';

export default class ConfigSet extends BaseCommand<typeof ConfigSet.flags> {
    static description = 'set Vonage CLI config'

    static flags = {
        ...BaseCommand.flags,
        'apiKey': flags.string({
            description: 'Vonage API Key',
        }),
        'apiSecret': flags.string({
            description: 'Vonage API Key',
        })
    }

    static args: ArgInput = []

    async run() {
        const flags = this.globalFlags
        //add start, stop process indicators
        this.saveConfig(merge({}, this.userConfig, flags))
        this.log('Configuration saved.')
    }
}
