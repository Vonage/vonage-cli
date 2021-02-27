import { flags } from '@oclif/command';
import Command from '../../helpers/base';
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ApplicationsList extends Command {
    static description = 'List Vonage applications'

    static examples = []

    static flags: flags.Input<any> = {
        ...Command.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv']
        })
    }

    async run() {
        console.log(this.vonage)
        const { flags } = this.parse(ApplicationsList)
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
