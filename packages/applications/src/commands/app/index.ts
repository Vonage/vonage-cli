import { AppCommand } from 'kja-cli-utils';
import { OutputFlags } from '@oclif/parser';

import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ApplicationsList extends AppCommand {
    static description = 'List Vonage applications'

    static examples = []

    static flags: OutputFlags<typeof AppCommand.flags> = {
        ...AppCommand.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv']
        })
    }

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof ApplicationsList.flags>
        let appData = await this.allApplications;
        let appList = appData['_embedded'].applications;
        cli.table(appList, {
            name: {},
            id: {},
            capabilities: {
                get: (row: any) => Object.keys(row['capabilities']).toString(),
            }
        }, {
            ...flags
        })
        this.exit();
    }

}
