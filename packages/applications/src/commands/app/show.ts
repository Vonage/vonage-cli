import Command from '../../helpers/base'
import {prompt} from 'prompts'
import chalk from 'chalk'

export default class ApplicationsShow extends Command {
    static description = 'Show Vonage application details';

    static examples = []

    static flags = {
        ...Command.flags,
    }

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

        const { args, flags } = this.parse(ApplicationsShow)
        let response = args;
        if (!args.appId) {
            let appData = await this.allApplications;
            let appList = appData['_embedded'].applications;
             
            response = await prompt([
                {
                    type: 'autocomplete',
                    name: 'appId',
                    message: 'Your Applications',
                    choices: this.setQuestions(appList),
                    initial: 0,
                }
            ])
            
        }

        let output = await this.getSingleApplication(response.appId);
        this.log(chalk.bold("Application ID:"), output.id)
        this.log(chalk.bold("Application Name:"), output.name)
        this.log(chalk.bold("Capabilities"), Object.keys(output.capabilities))
    }

    // async catch(error: any) {}
}
