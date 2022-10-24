import AppCommand from '../../app_base.js';
import { CliUx } from '@oclif/core';

const cli = CliUx.ux;

export default class ApplicationsLink
    extends AppCommand<typeof ApplicationsLink> {
    static description = 'manage your Vonage applications';

    static examples = ['vonage apps', 'vonage apps --output=json'];

    static flags = {
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv', 'extended', 'no-header'],
        }),
    };

    async run() {
        const flags = this.parsedFlags;
        const appData = await this.allApplications;
        const appList = appData['_embedded'].applications;

        cli.table(
            appList,
            {
                name: {},
                id: {},
                capabilities: {
                    get: (row: any) =>
                        Object.keys(row['capabilities']).toString(),
                },
            },
            {
                ...flags,
            },
        );

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
