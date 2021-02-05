import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
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
        help: flags.help({ char: 'h' }),
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

        let fArray = Object.keys(flags)
        let response = Object.assign({}, args, flags)

        // if no flags or arguments, use interactive mode
        if (!args.appId && fArray.length === 0) {
            let appData = await getAllApplications();
            let appList = appData['_embedded'].applications;
            let response = await prompt([
                {
                    type: 'autocomplete',
                    name: 'appId',
                    message: 'Your Applications',
                    choices: this.setQuestions(appList),
                    initial: 0,
                }])

            let app = getSingleApplication(response.appId)
            let selected_capabilities = Object.keys(app.capabilities);
            response = await prompt([
                {
                    type: 'multiselect',
                    name: 'selected_capabilities',
                    message: 'Select App Capabilities',
                    choices: [
                        { title: 'Voice', value: 'voice', selected: !!app.capabilities['voice']},
                        { title: 'Messages', value: 'messages', selected: !!app.capabilities['messages']},
                        { title: 'RTC', value: 'rtc', selected: !!app.capabilities['rtc']},
                        { title: 'VBC', value: 'vbc', selected: !!app.capabilities['vbc']}
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
                    let answer_url = await webhookQuestions({name: 'Answer Webhook'}) 
                    let fallback_answer_url = await webhookQuestions({name: 'Fallback Answer Webhook'}) 
                    let event_url = await webhookQuestions({name: 'Event Webhook'})
                    response.capabilities.voice = {webhooks: {answer_url, fallback_answer_url, event_url}}
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
                    let inbound_url = await webhookQuestions({name: 'Inbound Message Webhook', questions: 2}) 
                    let status_url = await webhookQuestions({name: 'Status Webhook', questions: 2}) 
                    response.capabilities.messages = {webhooks: {status_url, inbound_url}}
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
                    let event_url = await webhookQuestions({name: 'Event Webhook', questions: 2}) 
                    response.capabilities.rtc = {webhooks: {event_url}}
                } else {
                    response.capabilities.rtc = app.capabilities.rtc
                }
    
            }
    
            if (response.selected_capabilities?.indexOf('vbc') > -1) {
                response.capabilities.vbc = {} 
            }

            delete response.selected_capabilities
            updateApplication(Object.assign({}, app, response));
        }

        // if flags are provided but no appId, throw error
        if (!args.appId && fArray.length > 0) {
            console.error("Missing Required Argument: name")
        }

        // if name is provided, just create the application.
        // the SDK can verify the response
        if (args.name && fArray.length >= 0) {
            console.log("Creating Application")

            // needs to be in the right format from here
            updateApplication(response);
        }

        // handle SDK error responses

        // handle successful creation
    }

    // async catch(error:any) {
    //     if (error.oclif.exit !== 0){
    //         this.log(`${error.name}: ${error.message}`)
    //     }
    // }
}