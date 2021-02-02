import Command from '../base'
import { flags } from '@oclif/command'
import { prompt } from 'prompts'
import { webhookQuestions } from '../../helpers'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'


const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals], // colors can be omitted here as not used
    length: 2
});

export default class ApplicationsCreate extends Command {
    static description = 'create Vonage applications'

    static examples = [
        `$ vonage applications
hello world from ./src/hello.ts!
`,
    ]

    static flags = {
        ...Command.flags,
        'voice': flags.string({
            description: 'add voice capability'
        }),
        'messages': flags.string({
            description: 'add messages capability'
        }),
        'rtc': flags.string({
            description: 'add RTC capability'
        }),
        'vbc': flags.boolean({
            description: 'add VBC capability'
        })
    }

    static args = [
        { name: 'name', required: false }
    ]

    async run() {
        const { args, flags } = this.parse(ApplicationsCreate)

        let fArray = Object.keys(flags)
        let response = Object.assign({}, args, flags)

        // if no flags or arguments provided, make interactive

        if (!args.name && fArray.length === 0) {

            response = await prompt([
                {
                    type: 'text',
                    name: 'name',
                    message: `Application Name`,
                    initial: shortName
                }, {
                    type: 'multiselect',
                    name: 'selected_capabilities',
                    message: 'Select App Capabilities',
                    choices: [
                        { title: 'Voice', value: 'voice' },
                        { title: 'Messages', value: 'messages' },
                        { title: 'RTC', value: 'rtc' },
                        { title: 'VBC', value: 'vbc' }
                    ],
                    hint: '- Space to select. Return to submit'
                }
            ])


            response.capabilities = {};

            if (response.selected_capabilities?.indexOf('voice') > -1) {

                let voice = await prompt({
                    type: 'confirm',
                    name: 'voice-webhooks-confirm',
                    message: 'Create voice webhooks?'
                })

                if (voice['voice-webhooks-confirm']) {
                    let answer_url = await webhookQuestions({ name: 'Answer Webhook' })
                    let fallback_answer_url = await webhookQuestions({ name: 'Fallback Answer Webhook' })
                    let event_url = await webhookQuestions({ name: 'Event Webhook' })
                    response.capabilities.voice = { webhooks: { answer_url, fallback_answer_url, event_url } }
                }
            }

            if (response.selected_capabilities?.indexOf('messages') > -1) {


                let messages = await prompt({
                    type: 'confirm',
                    name: 'webhooks-confirm',
                    message: 'Create messages webhooks?'
                })

                if (messages['webhooks-confirm']) {
                    let inbound_url = await webhookQuestions({ name: 'Inbound Message Webhook', questions: 2 })
                    let status_url = await webhookQuestions({ name: 'Status Webhook', questions: 2 })
                    response.capabilities.messages = { webhooks: { status_url, inbound_url } }
                }


            }

            if (response.selected_capabilities?.indexOf('rtc') > -1) {

                let rtc = await prompt({
                    type: 'confirm',
                    name: 'webhooks-confirm',
                    message: 'Create RTC webhook?'
                })

                if (rtc['webhooks-confirm']) {
                    let event_url = await webhookQuestions({ name: 'Event Webhook', questions: 2 })
                    response.capabilities.rtc = { webhooks: { event_url } }
                }


            }

            if (response.selected_capabilities?.indexOf('vbc') > -1) {
                response.capabilities.vbc = {}
            }

            delete response.selected_capabilities

            //TO-DO - go check on a cleaner way to return the responses - shouldn't call twice
            this.createApplication(response);

        }




        // if flags are provided but no name, throw error
        if (!args.name && fArray.length > 0) {
            console.error("Missing Required Argument: name")
        }

        // if name is provided, just create the application.
        // the SDK can verify the response
        if (args.name && fArray.length >= 0) {
            console.log("Creating Application")

            // needs to be in the right format from here
            this.createApplication(response);
        }

        // handle SDK error responses

        // handle successful creation


    }

    // async catch(error: any) {
    //     if (error.oclif.exit !== 0) {
    //         this.log(`${error.name}: ${error.message}`)
    //     }
    // }
}
