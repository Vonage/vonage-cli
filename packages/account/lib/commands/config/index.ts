import VonageCommand from '@vonage/cli-utils';

export default class ConfigList extends VonageCommand<typeof ConfigList> {
    static description = 'Display Vonage CLI configuration';

    static examples = [];

    async run() {
        this.log('~~~User Config~~~');
        this.log(JSON.stringify(
            Object.assign({}, this._userConfig),
            null,
            2,
        ));
    }
}
