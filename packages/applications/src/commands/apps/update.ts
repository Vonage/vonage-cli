import AppCommand from '../../app_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { CliUx, Flags } from '@oclif/core';
import { webhookQuestions } from '../../helpers/index.js';
import chalk from 'chalk';
import _ from 'lodash';
import { VonageCliFlags } from '@vonage/cli-utils';
import prompts from 'prompts';

const { prompt } = prompts;

const cli = CliUx.ux;

interface UpdateFlags extends VonageCliFlags<typeof ApplicationsUpdate>{
    voice_answer_url: any;
    voice_answer_http: any;
    voice_event_url: any;
    voice_event_http: any;
    messages_inbound_url: any;
    messages_inbound_http: any;
    messages_status_url: any;
    messages_status_http: any;
    rtc_event_url: any;
    rtc_event_http: any;
    vbc: any;
}

export default class ApplicationsUpdate extends AppCommand<
    typeof ApplicationsUpdate.flags
> {
    static description = 'update a Vonage application';

    static examples = [
        `vonage apps:update`,
        'vonage apps:update APP_ID --voice_answer_url="https://www.example.com/answer',
    ];

    static flags = {
        voice_answer_url: Flags.string({
            description: 'Voice Answer Webhook URL Address',
            parse: async (input) =>
                `{"voice": {"webhooks": {"answer_url": {"address": "${input}"}}}}`,
        }),
        voice_answer_http: Flags.string({
            description: 'Voice Answer Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: async (input) =>
                `{"voice": {"webhooks": {"answer_url": {"http_method": "${input}"}}}}`,
        }),
        voice_event_url: Flags.string({
            description: 'Voice Event Webhook URL Address',
            parse: async (input) =>
                `{"voice": {"webhooks": {"event_url": {"address": "${input}"}}}}`,
        }),
        voice_event_http: Flags.string({
            description: 'Voice Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: async (input) =>
                `{"voice": {"webhooks": {"event_url": {"http_method": "${input}"}}}}`,
        }),
        messages_inbound_url: Flags.string({
            description: 'Messages Inbound Webhook URL Address',
            parse: async (input) =>
                `{"messages": {"webhooks": {"inbound_url": {"address": "${input}"}}}}`,
        }),
        messages_inbound_http: Flags.string({
            description: 'Messages Inbound Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: async (input) =>
                `{"messages": {"webhooks": {"inbound_url": {"http_method": "${input}"}}}}`,
        }),
        messages_status_url: Flags.string({
            description: 'Messages Status Webhook URL Address',
            parse: async (input) =>
                `{"messages": {"webhooks": {"status_url": {"address": "${input}"}}}}`,
        }),
        messages_status_http: Flags.string({
            description: 'Messages Status Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: async (input) =>
                `{"messages": {"webhooks": {"status_url": {"http_method": "${input}"}}}}`,
        }),
        rtc_event_url: Flags.string({
            description: 'RTC Event Webhook URL Address',
            parse: async (input) =>
                `{"rtc": {"webhooks": {"event_url": {"address": "${input}"}}}}`,
        }),
        rtc_event_http: Flags.string({
            description: 'RTC Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            parse: async (input) =>
                `{"rtc": {"webhooks": {"event_url": {"http_method": "${input}"}}}}`,
        }),
        vbc: Flags.boolean({
            description: 'VBC Capabilities Enabled',
        }),
    };

    static args: ArgInput = [{ name: 'appId', required: false }];

    setQuestions(list: any) {
        return list.map((application: any) => {
            return {
                title: `${application.name} | ${application.id}`,
                value: application.id,
            };
        });
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
                    { title: 'Update', value: 'update' },
                ],
            },
        ]);
    }

    async run() {
        const flags = this.parsedFlags as UpdateFlags;
        const args = this.parsedArgs!;
        let response = args;

        if (!response.appId) {
            const appData = await this.allApplications;
            const appList = appData['_embedded'].applications;

            response = await prompt([
                {
                    type: 'autocomplete',
                    name: 'appId',
                    message: 'Select Application',
                    choices: this.setQuestions(appList),
                    initial: 0,
                },
            ]);
        }

        const oldAppState = await this.getSingleApplication(response.appId);
        const newAppState = Object.assign({}, oldAppState);

        if (Object.keys(flags).length > 0) {
            // merge flags into new object
            const tobeAssigned = Object.keys(flags).map(
                (value: string) => {
                    return JSON.parse(flags[value]);
                },
                [],
            );

            _.merge(newAppState.capabilities, ...tobeAssigned);
        } else {
            // run interactive

            const menu = await this.menuOptions();
            let updateItem = menu.updateSelection;

            while (updateItem !== 'update' && updateItem !== 'cancel') {
                let { voice, messages, rtc } = oldAppState.capabilities;

                if (updateItem === 'name') {
                    const { newAppName } = await prompt([
                        {
                            type: 'text',
                            name: 'newAppName',
                            message: 'Update Name',
                            initial: oldAppState.name,
                        },
                    ]);
                    newAppState.name = newAppName;
                }

                if (updateItem === 'voice') {
                    if (!voice) {
                        voice = {
                            webhooks: {
                                answer_url: { address: '', http_method: '' },
                                event_url: { address: '', http_method: '' },
                            },
                        };
                    }

                    const newAnswerUrl = await webhookQuestions({
                        name: 'Answer Webhook',
                        url: _.get(voice, 'webhooks.answer_url.address'),
                        method: _.get(voice, 'webanswer_url.method'),
                    });
                    const newEventUrl = await webhookQuestions({
                        name: 'Event Webhook',
                        url: _.get(voice, 'webhooks.event_url.address'),
                        method: _.get(voice, 'webhooks.answer_url.method'),
                    });
                    newAppState.capabilities.voice = {
                        webhooks: {
                            answer_url: newAnswerUrl,
                            event_url: newEventUrl,
                        },
                    };
                }

                if (updateItem === 'messages') {
                    if (!messages) {
                        messages = {
                            webhooks: {
                                inbound_url: { address: '', http_method: '' },
                                status_url: { address: '', http_method: '' },
                            },
                        };
                    }

                    const newInboundUrl = await webhookQuestions({
                        name: 'Inbound Message Webhook',
                        url: _.get(messages, 'webhooks.inbound_url.address'),
                        method: _.get(messages, 'webhooks.inbound_url.method'),
                    });
                    const newStatusUrl = await webhookQuestions({
                        name: 'Status Webhook',
                        url: _.get(messages, 'webhooks.status_url.address'),
                        method: _.get(messages, 'webhooks.status_url.method'),
                    });

                    newAppState.capabilities.messages = {
                        webhooks: {
                            inbound_url: newInboundUrl,
                            status_url: newStatusUrl,
                        },
                    };
                }

                if (updateItem === 'rtc') {
                    if (!rtc) {
                        rtc = {
                            webhooks: {
                                event_url: { address: '', http_method: '' },
                            },
                        };
                    }

                    const newEventUrl = await webhookQuestions({
                        name: 'Event Webhook',
                        url: _.get(rtc, 'event_url.address'),
                        method: _.get(rtc, 'event_url.method'),
                    });
                    newAppState.capabilities.rtc = {
                        webhooks: { event_url: newEventUrl },
                    };
                }

                if (updateItem === 'vbc') {
                    this.log('Update VBC');
                }

                if (updateItem === 'key') {
                    this.log('Update Private Key');
                }

                const menu = await this.menuOptions();
                updateItem = menu.updateSelection;
            }

            if (updateItem === 'cancel') {
                this.log(chalk.bold('Application update cancelled.'));
                this.exit();
            }
        }

        cli.action.start(chalk.bold(`Updating "${newAppState.name}"`));
        await this.updateApplication(newAppState);
        cli.action.stop();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
