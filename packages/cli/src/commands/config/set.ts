import Command from '@vonage/cli-utils';
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigSet extends Command {
    static description = 'List Vonage CLI config'

    static examples = []

    async run() {
        this.log(this.userConfig)
    }

}
