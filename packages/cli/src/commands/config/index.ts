import BaseCommand from '@vonage/cli-utils';
import cli from 'cli-ux'

export default class ConfigList extends BaseCommand {
    static description = 'manage Vonage CLI configuration'

    static examples = []

    async run() {
        this.log("~~~User Config~~~")
        cli.log(JSON.stringify(Object.assign({}, this.userConfig)))
    }

}
