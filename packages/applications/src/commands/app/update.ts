import Command from '../base'
import { flags } from '@oclif/command'
import { prompt } from 'prompts'
import { webhookQuestions } from '../../helpers'

export default class ApplicationsUpdate extends Command {
    static description = 'update Vonage applications'

    static examples = [
        `$ vonage applications
hello world from ./src/hello.ts!
`,
    ]

    static flags = {
        ...Command.flags,
        'voice-answer-url': flags.string({
            description: 'Voice Answer Webhook URL Address'
        }),
        'voice-answer-http': flags.string({
            description: 'Voice Answer Webhook HTTP Method',
            options: ['GET', 'POST']
        }),
        'voice-event-url': flags.string({
            description: 'Voice Event Webhook URL Address'
        }),
        'voice-event-http': flags.string({
            description: 'Voice Event Webhook HTTP Method',
            options: ['GET', 'POST']
        }),
        'messages-inbound-url': flags.string({
            description: 'Messages Inbound Webhook URL Address'
        }),
        'messages-inbound-http': flags.string({
            description: 'Messages Inbound Webhook HTTP Method',
            options: ['GET', 'POST']
        }),
        'messages-status-url': flags.string({
            description: 'Messages Status Webhook URL Address'
        }),
        'messages-status-http': flags.string({
            description: 'Messages Status Webhook HTTP Method',
            options: ['GET', 'POST']
        }),
        'rtc-event-url': flags.string({
            description: 'RTC Event Webhook URL Address',
        }),
        'rtc-event-http': flags.string({
            description: 'RTC Event Webhook HTTP Method',
            options: ['GET', 'POST']
        })
        
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
        const { args, flags } = this.parse(ApplicationsUpdate)
        let app;
        let fArray = Object.keys(flags)
        let response = Object.assign({}, args, flags)

        // if no flags or arguments, use interactive mode
        if (!args.appId && fArray.length === 0) {
            let appData = await this.allApplications;
            let appList = appData['_embedded'].applications;
            let response = await prompt([
                {
                    type: 'autocomplete',
                    name: 'appId',
                    message: 'Your Applications',
                    choices: this.setQuestions(appList),
                    initial: 0,
                }])

            app = this.getSingleApplication(response.appId)
            let selected_capabilities = Object.keys(app.capabilities);

            response = await prompt([
                {
                    type: 'multiselect',
                    name: 'selected_capabilities',
                    message: 'Select App Capabilities',
                    choices: [
                        { title: 'Voice', value: 'voice', selected: !!app.capabilities['voice'] },
                        { title: 'Messages', value: 'messages', selected: !!app.capabilities['messages'] },
                        { title: 'RTC', value: 'rtc', selected: !!app.capabilities['rtc'] },
                        { title: 'VBC', value: 'vbc', selected: !!app.capabilities['vbc'] }
                    ],
                    hint: '- Space to select. Return to submit'
                }
            ])

            response.capabilities = {};

            if (response.selected_capabilities?.indexOf('voice') > -1) {

                let voice = await prompt({
                    type: 'confirm',
                    name: 'voice-webhooks-confirm',
                    message: 'Update voice webhooks?'
                })

                // tie in the current data if available
                if (voice['voice-webhooks-confirm']) {
                    let answer_url = await webhookQuestions({ name: 'Answer Webhook' })
                    let fallback_answer_url = await webhookQuestions({ name: 'Fallback Answer Webhook' })
                    let event_url = await webhookQuestions({ name: 'Event Webhook' })
                    response.capabilities.voice = { webhooks: { answer_url, fallback_answer_url, event_url } }
                } else {
                    response.capabilities.voice = app.capabilities.voice
                }
            }

            if (response.selected_capabilities?.indexOf('messages') > -1) {
                let messages = await prompt({
                    type: 'confirm',
                    name: 'webhooks-confirm',
                    message: 'Update messages webhooks?'
                })

                // tie in the current data if available
                if (messages['webhooks-confirm']) {
                    let inbound_url = await webhookQuestions({ name: 'Inbound Message Webhook', questions: 2 })
                    let status_url = await webhookQuestions({ name: 'Status Webhook', questions: 2 })
                    response.capabilities.messages = { webhooks: { status_url, inbound_url } }
                } else {
                    response.capabilities.messages = app.capabilities.messages
                }
            }

            if (response.selected_capabilities?.indexOf('rtc') > -1) {
                let rtc = await prompt({
                    type: 'confirm',
                    name: 'webhooks-confirm',
                    message: 'Update RTC webhook?'
                })

                // tie in the current data if available
                if (rtc['webhooks-confirm']) {
                    let event_url = await webhookQuestions({ name: 'Event Webhook', questions: 2 })
                    response.capabilities.rtc = { webhooks: { event_url } }
                } else {
                    response.capabilities.rtc = app.capabilities.rtc
                }

            }

            if (response.selected_capabilities?.indexOf('vbc') > -1) {
                response.capabilities.vbc = {}
            }

            delete response.selected_capabilities
            this.updateApplication(Object.assign({}, app, response));
        }

        // if flags are provided but no appId, throw error
        if (!args.appId && fArray.length > 0) {
            console.error("Missing Required Argument: name")
        }

        // if name is provided, just create the application.
        // the SDK can verify the response
        if (args.name && fArray.length >= 0) {
            console.log("Creating Application")
            app = this.getSingleApplication(response.appId)
            response = this.normailzeResponseInput(response);

        }

        console.log(Object.assign({}, app, response))

        // this.updateApplication(Object.assign({}, app, response))
        // handle SDK error responses

        // handle successful creation
    }

    // async catch(error:any) {
    //     if (error.oclif.exit !== 0){
    //         this.log(`${error.name}: ${error.message}`)
    //     }
    // }
}
