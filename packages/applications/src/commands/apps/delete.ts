import Command from '../base'
import {prompt} from 'prompts'
import {getAllApplications, deleteApplication} from '../../helpers'

export default class ApplicationsDelete extends Command {
    static description = 'delete Vonage application'

    static examples = [
        `$ vonage apps:delete
hello world from ./src/hello.ts!
`,
    ]

    static flags = {
        ...Command.flags
    }

    static args = [
        {name: 'appId', required: false},
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
        const {args, flags} = this.parse(ApplicationsDelete)
        let userInput = Object.assign({}, args, flags)

        if (!userInput.appId) {
            let appData = await this.allApplications;
            let appList = appData['_embedded'].applications;
            let response = await prompt([
                {
                    type: 'autocomplete',
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
            delete response.confirm
            this.deleteApplication(response.appId)
        }

        if (userInput.appId) {
            this.deleteApplication(userInput.appId)
        }
        
        // handle errors from SDK

        // handle success from SDK

    }

    async catch(error:any) {
        if (error.oclif.exit !== 0){
            this.log(`${error.name}: ${error.message}`)
        }
    }
}
