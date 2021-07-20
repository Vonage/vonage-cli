import BaseCommand from '@vonage/cli-utils';
import { flags } from '@oclif/command'
import { merge } from 'lodash';

export default class ConfigSet extends BaseCommand {
    static description = 'set Vonage CLI config'

    static flags = {
        ...BaseCommand.flags,
        'apiKey': flags.string({
            description: 'Vonage API Key',
        }),
        'apiSecret': flags.string({
            description: 'Vonage API Key',
        }),
        'appId': flags.string({
            description: 'Default Application ID',
        }),
        'privateKey': flags.string({
            description: 'Default Application Private Key',
        })
    }

    static args = [
        ...BaseCommand.args,
    ]

    async run() {
        const flags = this.globalFlags

        //add start, stop process indicators
        this.saveConfig(merge({}, this.userConfig, flags))
        this.log('Configuration saved.')
    }
}
