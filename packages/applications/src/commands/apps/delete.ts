import AppCommand from '../../app_base';
import { prompt } from 'prompts'
import { ArgInput } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import cli from 'cli-ux';

export default class ApplicationsDelete extends AppCommand<typeof ApplicationsDelete.flags> {
    static description = 'delete a Vonage application'

    static flags = {
        ...AppCommand.flags,
    }

    static examples = [
        `vonage apps:delete 00000000-0000-0000-0000-000000000000`,
        `vonage apps:delete`
    ]

    static args: ArgInput = [
        { name: 'appId', required: false },
    ]

    setQuestions(list: any) {
        return list.map((application: any) => {
            return {
                title: `${application.name} | ${application.id}`,
                value: application.id
            }
        })
    }

    async run() {
        // const flags = this.parsedFlags
        const args = this.parsedArgs!

        if (!args.appId) {
            let appData = await this.allApplications;
            let appList = appData['_embedded'].applications;
            let response = await prompt([
                {
                    type: 'autocompleteMultiselect',
                    name: 'appId',
                    message: 'Your Applications',
                    choices: this.setQuestions(appList),
                    initial: 0,
                },
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `Confirm deletion?`,
                    initial: false
                }
            ])
            if (response.confirm) {
                delete response.confirm
                let plural = response.appId.length > 1 ? 's' : '';
                cli.action.start(chalk.bold(`Deleting ${response.appId.length} Application${plural}`), 'Initializing', { stdout: true })

                response.appId.map((v: any) => {
                    this.deleteApplication(v)
                    this.log(`Application ${v} deleted.`)
                })

                cli.action.stop()
            } else {
                this.log(chalk.bold('Delete cancelled.'));
            }

        }

        if (args.appId) {
            this.deleteApplication(args.appId)
            this.log(`Application ${args.appId} deleted.`)
        }

        this.exit();

    }

    async catch(error: any) {
        return super.catch(error);
    }

}
