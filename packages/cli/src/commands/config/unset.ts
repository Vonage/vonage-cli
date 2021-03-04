import BaseCommand from '@vonage/cli-utils';
// import { OutputFlags } from '@oclif/parser';

// import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ConfigUnset extends BaseCommand {
    static description = 'Unset Vonage CLI config values'

    static examples = []

    static args = []

    async run() {
        // const flags = this.parsedFlags as OutputFlags<typeof ConfigUnset.flags>
        // const args = this.parsedArgs!;

        this.log("Not quite functional")
    }

    async catch(error: any) {
        this.log(error);
    }

}
