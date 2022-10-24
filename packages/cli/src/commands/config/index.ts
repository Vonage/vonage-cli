import VonageCommand from '@vonage/cli-utils';
import { CliUx } from '@oclif/core';

const cli = CliUx.ux;

export default class ConfigList extends VonageCommand<typeof ConfigList> {
    static description = 'manage Vonage CLI configuration';

    static examples = [];

    async run() {
        this.log('~~~User Config~~~');
        cli.log(JSON.stringify(Object.assign({}, this._userConfig)));
    }
}
