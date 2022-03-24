import AppCommand from '../../app_base';
import cli from 'cli-ux'
import { OutputFlags } from '@oclif/parser';

export default class ApplicationsLink extends AppCommand<typeof ApplicationsLink.flags> {
    static description = 'manage your Vonage applications'

    static examples = ['vonage apps', 'vonage apps --output=json']

    static flags: OutputFlags<typeof AppCommand.flags> = {
        ...AppCommand.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv', 'extended', 'no-header']
        })
    }

    async run() {
        const flags = this.parsedFlags
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

    async catch(error: any) {
        return super.catch(error);
    }

}
