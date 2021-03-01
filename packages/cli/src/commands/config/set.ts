import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

import { flags } from '@oclif/command'

// import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigSet extends BaseCommand {
    static description = 'List Vonage CLI config'

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
        const flags = this.parsedFlags as OutputFlags<typeof ConfigSet.flags>

        //add start, stop process indicators
        this.saveConfig(Object.assign({}, this.userConfig, flags))
    }
}
