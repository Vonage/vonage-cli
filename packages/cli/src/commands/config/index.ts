import BaseCommand from '@vonage/cli-utils';
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigList extends BaseCommand {
    static description = 'manage Vonage CLI configuration'

    static examples = []

    async run() {
        const flags = this.parsedFlags
        this.log("~~~User Conifg~~~")
        cli.log(JSON.stringify(Object.assign({}, this.userConfig, flags)))
    }

}
