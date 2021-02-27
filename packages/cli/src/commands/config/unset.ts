import Command from '@vonage/cli-utils';
// import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigUnset extends Command {
    static description = 'Unset Vonage CLI config values'

    static examples = []

    static args = []

    async run() {
        this.log(JSON.stringify(this.userConfig))
    }

    async catch(error: any) {
        this.log(error);
    }

}
