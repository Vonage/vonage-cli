import { AppCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

import cli from 'cli-ux'

export default class ApplicationsList extends AppCommand {
    static description = 'manage your Vonage applications'

    static examples = ['vonage app', 'vonage app --output=json']

    static flags: OutputFlags<typeof AppCommand.flags> = {
        ...AppCommand.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv', 'extended', 'no-header']
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
