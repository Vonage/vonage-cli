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
