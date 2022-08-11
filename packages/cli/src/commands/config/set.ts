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
            description: 'Vonage API Secret',
        }),
        'apiHost': flags.string({
            description: 'Optional preferred Vonage API Host, e.g. api-us-1.nexmo.com'
        }),
        'restHost': flags.string({
            description: 'Optional preferred Vonage Rest API Host, e.g. rest-us-1.nexmo.com'
        }),
        'videoHost': flags.string({
            description: 'Optional preferred Vonage Video API Host'
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
