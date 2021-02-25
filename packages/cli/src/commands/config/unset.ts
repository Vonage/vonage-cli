import Command from '@vonage/cli-utils';
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigUnset extends Command {
    static description = 'Unset Vonage CLI config values'

    static examples = []

    static args = [
        { name: 'appId', required: false },
        { name: 'number', required: false }
    ]

    async run() {
        this.log(this.userConfig)
    }

}
