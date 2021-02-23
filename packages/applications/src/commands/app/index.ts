import Command from '../../helpers/base';
import { flags } from '@oclif/command';

import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ApplicationsList extends Command {
    static description = 'List Vonage applications'

    static examples = []

    static flags = {
        ...Command.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv']
        })
    }

    async run() {
        const { args, flags } = this.parse(ApplicationsList)
        let appData = await this.allApplications;
        let appList = appData['_embedded'].applications;
        cli.table(appList, {
            name: {},
            id: {},
            capabilities: {
                get: row => Object.keys(row['capabilities']).toString(),
            }
        }, {
            ...flags
        })
        this.exit();
    }

}
