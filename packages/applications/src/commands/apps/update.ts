import AppCommand from '../../app_base';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { flags } from '@oclif/command'
import { prompt } from 'prompts'
import { webhookQuestions } from '../../helpers'
import { merge } from 'lodash';
import cli from 'cli-ux';
import chalk from 'chalk';

interface UpdateFlags {
    voice_answer_url: any,
    voice_answer_http: any,
    voice_event_url: any,
    voice_event_http: any,
    messages_inbound_url: any,
    messages_inbound_http: any,
    messages_status_url: any,
    messages_status_http: any,
    rtc_event_url: any,
    rtc_event_http: any,
    vbc: any
}

export default class ApplicationsUpdate extends AppCommand<typeof ApplicationsUpdate.flags> {
    static description = 'update a Vonage application'

    static examples = [`vonage apps:update`, 'vonage apps:update APP_ID --voice_answer_url="https://www.example.com/answer']

    static flags: OutputFlags<typeof AppCommand.flags> & UpdateFlags = {
        ...AppCommand.flags,
        'voice_answer_url': flags.string({
            description: 'Voice Answer Webhook URL Address',
            parse: input => `{"voice": {"webhooks": {"answer_url": {"address": "${input}"}}}}`
        }),
        'voice_answer_http': flags.string({
            description: 'Voice Answer Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: input => `{"voice": {"webhooks": {"answer_url": {"http_method": "${input}"}}}}`
        }),
        'voice_event_url': flags.string({
            description: 'Voice Event Webhook URL Address',
            parse: input => `{"voice": {"webhooks": {"event_url": {"address": "${input}"}}}}`
        }),
        'voice_event_http': flags.string({
            description: 'Voice Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: input => `{"voice": {"webhooks": {"event_url": {"http_method": "${input}"}}}}`
        }),
        'messages_inbound_url': flags.string({
            description: 'Messages Inbound Webhook URL Address',
            parse: input => `{"messages": {"webhooks": {"inbound_url": {"address": "${input}"}}}}`
        }),
        'messages_inbound_http': flags.string({
            description: 'Messages Inbound Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: input => `{"messages": {"webhooks": {"inbound_url": {"http_method": "${input}"}}}}`
        }),
        'messages_status_url': flags.string({
            description: 'Messages Status Webhook URL Address',
            parse: input => `{"messages": {"webhooks": {"status_url": {"address": "${input}"}}}}`
        }),
        'messages_status_http': flags.string({
            description: 'Messages Status Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: input => `{"messages": {"webhooks": {"status_url": {"http_method": "${input}"}}}}`
        }),
        'rtc_event_url': flags.string({
            description: 'RTC Event Webhook URL Address',
            parse: input => `{"rtc": {"webhooks": {"event_url": {"address": "${input}"}}}}`
        }),
        'rtc_event_http': flags.string({
            description: 'RTC Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: input => `{"rtc": {"webhooks": {"event_url": {"http_method": "${input}"}}}}`
        }),
        'vbc': flags.boolean({
            description: 'VBC Capabilities Enabled',
        })
    }

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

    async menuOptions() {
        return await prompt([
            {
                type: 'select',
                name: 'updateSelection',
                message: 'Select Item to Update',
                choices: [
                    { title: 'Application Name', value: 'name' },
                    { title: 'Voice Settings', value: 'voice' },
                    { title: 'Messages Settings', value: 'messages' },
                    { title: 'RTC Settings', value: 'rtc' },
                    { title: 'Cancel', value: 'cancel' },
                    { title: 'Update', value: 'update' }
                ],
            }
        ])
    }

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;
        let response = args;
        let oldAppState, newAppState

        if (!response.appId) {
            let appData = await this.allApplications;
            let appList = appData['_embedded'].applications;

            response = await prompt([
                {
                    type: 'autocomplete',
                    name: 'appId',
                    message: 'Select Application',
                    choices: this.setQuestions(appList),
                    initial: 0,
                }
            ])
        }

        oldAppState = await this.getSingleApplication(response.appId);
        newAppState = Object.assign({}, oldAppState);

        if (Object.keys(flags).length > 0) {
            //merge flags into new object
            let tobeAssigned = Object.keys(flags).map((value: string, index) => {
                return JSON.parse(flags[value])
            }, [])

            merge(newAppState.capabilities, ...tobeAssigned)

        } else {
            //run interactive

            let menu = await this.menuOptions();
            let updateItem = menu.updateSelection;

            while (updateItem !== 'update' && updateItem !== 'cancel') {
                let { voice, messages, rtc } = oldAppState.capabilities

                if (updateItem === 'name') {
                    let { newAppName } = await prompt([
                        {
                            type: 'text',
                            name: 'newAppName',
                            message: 'Update Name',
                            initial: oldAppState.name
                        }
                    ])
                    newAppState.name = newAppName
                }

                if (updateItem === 'voice') {

                    if (!voice) voice = { webhooks: { answer_url: { address: '', http_method: '' }, event_url: { address: '', http_method: '' } } }

                    let { answer_url, event_url } = voice.webhooks
                    let new_answer_url = await webhookQuestions({ name: 'Answer Webhook', url: answer_url.address, method: answer_url.method })
                    let new_event_url = await webhookQuestions({ name: 'Event Webhook', url: event_url.address, method: answer_url.method })
                    newAppState.capabilities.voice = {
                        webhooks: { answer_url: new_answer_url, event_url: new_event_url }
                    }
                }

                if (updateItem === 'messages') {

                    if (!messages) messages = { webhooks: { inbound_url: { address: '', http_method: '' }, status_url: { address: '', http_method: '' } } }

                    let { inbound_url, status_url } = messages.webhooks
                    let new_inbound_url = await webhookQuestions({ name: 'Inbound Message Webhook', url: inbound_url.address, method: inbound_url.method })
                    let new_status_url = await webhookQuestions({ name: 'Status Webhook', url: status_url.address, method: status_url.method })

                    newAppState.capabilities.messages = {
                        webhooks: { inbound_url: new_inbound_url, status_url: new_status_url }
                    }
                }

                if (updateItem === 'rtc') {

                    if (!rtc) rtc = { webhooks: { event_url: { address: '', http_method: '' } } }

                    let { event_url } = rtc.webhooks
                    let new_event_url = await webhookQuestions({ name: 'Event Webhook', url: event_url.address, method: event_url.method })
                    newAppState.capabilities.rtc = {
                        webhooks: { event_url: new_event_url }
                    }
                }

                if (updateItem === 'vbc') {
                    this.log('Update VBC')
                }

                if (updateItem === 'key') {
                    this.log('Update Private Key')
                }

                let menu = await this.menuOptions();
                updateItem = menu.updateSelection;
            }

            if (updateItem === 'cancel') {
                this.log(chalk.bold('Application update cancelled.'))
                this.exit();
            }

        }


        cli.action.start(chalk.bold(`Updating "${newAppState.name}"`))
        await this.updateApplication(newAppState);
        cli.action.stop()
    }

    async catch(error: any) {
        return super.catch(error);
    }
}