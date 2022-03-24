import AppCommand from '../../app_base';
import { prompt } from 'prompts'
import { ArgInput } from '@oclif/core/lib/interfaces';
import chalk from 'chalk'

export default class ApplicationsShow extends AppCommand<typeof ApplicationsShow.flags> {
    static description = 'show Vonage application details';

    static flags = {
        ...AppCommand.flags,
    }

    static examples = []

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
        const args = this.parsedArgs!;
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
        let indent = '  '

        this.log(chalk.magenta.underline.bold("Application Name:"), output.name)
        this.log('')
        this.log(chalk.magenta.underline.bold("Application ID:"), output.id)
        this.log('')

        let { voice, messages, rtc, vbc } = output.capabilities

        if (voice) {
            let { event_url, answer_url } = voice.webhooks

            this.log(chalk.magenta.underline.bold("Voice Settings"))

            this.log(indent, chalk.cyan.underline.bold("Event Webhook:"))
            this.log(indent, indent, chalk.bold('Address:'), event_url.address)
            this.log(indent, indent, chalk.bold('HTTP Method:'), event_url.http_method)

            this.log(indent, chalk.cyan.underline.bold("Answer Webhook:"))
            this.log(indent, indent, chalk.bold('Address:'), answer_url.address)
            this.log(indent, indent, chalk.bold('HTTP Method:'), answer_url.http_method)
            this.log('')
        }

        if (messages) {
            let { inbound_url, status_url } = messages.webhooks

            this.log(chalk.magenta.underline.bold("Messages Settings"))

            this.log(indent, chalk.cyan.underline.bold("Inbound Webhook:"))
            this.log(indent, indent, chalk.bold('Address:'), inbound_url.address)
            this.log(indent, indent, chalk.bold('HTTP Method:'), inbound_url.http_method)

            this.log(indent, chalk.cyan.underline.bold("Status Webhook:"))
            this.log(indent, indent, chalk.bold('Address:'), status_url.address)
            this.log(indent, indent, chalk.bold('HTTP Method:'), status_url.http_method)
            this.log('')
        }

        if (rtc) {
            let { event_url } = rtc.webhooks
            this.log(chalk.magenta.underline.bold("RTC Settings"))

            this.log(indent, chalk.cyan.underline.bold("Event Webhook:"))
            this.log(indent, indent, chalk.bold('Address:'), event_url.address)
            this.log(indent, indent, chalk.bold('HTTP Method:'), event_url.http_method)
            this.log('')
        }

        if (vbc) {
            this.log(chalk.magenta.underline.bold("VBC Settings"))
            this.log(chalk.bold("Enabled"))
            this.log('')
        }

        this.log(chalk.magenta.underline.bold("Public Key"))
        this.log(output.keys.public_key)
        this.log('')


        this.exit();

    }

    async catch(error: any) {
        return super.catch(error);
    }
}
