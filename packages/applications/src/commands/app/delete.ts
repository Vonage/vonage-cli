import { AppCommand } from '@vonage/cli-utils';
import { prompt } from 'prompts'
import chalk from 'chalk';
import cli from 'cli-ux';

export default class ApplicationsDelete extends AppCommand {
    static description = 'delete Vonage application'

    static examples = []

    static args = [
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
        const flags = this.parsedFlags
        const args = this.parsedArgs!;
        let userInput = Object.assign({}, args, flags)

        if (!userInput.appId) {
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
                    message: `Confirm deletion of application?`,
                    initial: false
                }
            ])
            if (response.confirm) {
                delete response.confirm
                let plural = response.appId.length > 1 ? 's' : '';
                cli.action.start(chalk.bold(`Deleting ${response.appId.length} Application${plural}`), 'Initializing', { stdout: true })

                response.appId.map((v: any) => {
                    this.deleteApplication(v)
                })

                cli.action.stop()
            } else {
                this.log(chalk.bold('Delete cancelled.'));
            }

        }

        if (userInput.appId) {
            this.deleteApplication(userInput.appId)
        }

        this.exit();

    }

    // async catch(error:any) {}
}
