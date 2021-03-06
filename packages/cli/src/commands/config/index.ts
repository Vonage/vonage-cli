import BaseCommand from 'kja-cli-utils';
import { OutputFlags } from '@oclif/parser';
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigList extends BaseCommand {
    static description = 'List Vonage CLI config'

    static examples = []

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof ConfigList.flags>
        this.log("~~~User Conifg~~~")
        cli.log(JSON.stringify(Object.assign({}, this.userConfig, flags)))
    }

}
