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
        'keyFile': flags.string({
            description: 'Default Application Private Key file location',
        })
    }

    static args = [
        ...BaseCommand.args,
    ]

    async run() {
        const flags = this.globalFlags

        //add start, stop process indicators
        console.log(flags)
        this.saveConfig(merge({}, this.userConfig, flags))
        this.log('Configuration saved.')
    }
}
