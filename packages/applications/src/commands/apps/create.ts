import AppCommand from '../../app_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { Flags, CliUx } from '@oclif/core';
import prompts from 'prompts';
import { webhookQuestions, sanitizeFileName } from '../../helpers/index.js';
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
} from 'unique-names-generator';
import { writeFileSync } from 'fs';
import _ from 'lodash';
import chalk from 'chalk';
const { prompt } = prompts;

const cli = CliUx.ux;

const shortName = uniqueNamesGenerator({
    // colors can be omitted here as not used
    dictionaries: [adjectives, animals],
    length: 2,
});

const kbArticle = 'https://help.nexmo.com/hc/en-us/articles/4401914566036';

export default class ApplicationsCreate
    extends AppCommand<typeof ApplicationsCreate> {
    static description = 'create a new Vonage application';

    static examples = [
        'vonage apps:create',
        'vonage apps:create APP_NAME --voice_answer_url=https://www.sample.com --voice_event_url=https://www.sample.com',
    ];

    static flags = {
        voice_answer_url: Flags.string({
            description: 'Voice Answer Webhook URL Address',
            dependsOn: ['voice_event_url'],
            parse: async (input) =>
                `{"voice": {"webhooks": {"answer_url": {"address": "${input}"}}}}`,
        }),
        voice_answer_http: Flags.string({
            description: 'Voice Answer Webhook HTTP Method',
            options: ['GET', 'POST'],
            dependsOn: ['voice_answer_url'],
            parse: async (input) =>
                `{"voice": {"webhooks": {"answer_url": {"http_method": "${input}"}}}}`,
        }),
        voice_event_url: Flags.string({
            description: 'Voice Event Webhook URL Address',
            dependsOn: ['voice_answer_url'],
            parse: async (input) =>
                `{"voice": {"webhooks": {"event_url": {"address": "${input}"}}}}`,
        }),
        voice_event_http: Flags.string({
            description: 'Voice Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            dependsOn: ['voice_event_url'],
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
            dependsOn: ['messages_inbound_url'],
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
            dependsOn: ['messages_status_url'],
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
            dependsOn: ['rtc_event_url'],
            parse: async (input) =>
                `{"rtc": {"webhooks": {"event_url": {"http_method": "${input}"}}}}`,
        }),
        vbc: Flags.boolean({
            description: 'VBC Capabilities Enabled',
            parse: async () => `{"vbc": {}}`,
        }),
        improve_ai: Flags.boolean({
            description: `Allow use of data for AI training? Read data collection disclosure - ${kbArticle}`,
        }),
    };

    static args: ArgInput = [{ name: 'name', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;
        let response: any = {
            name: '',
            capabilities: {},
            privacy: { improve_ai: false },
        };

        if (!args.name && Object.keys(flags).length > 0) {
            this.error(new Error('Argument "name" not provided'));
        }

        if (args.name && Object.keys(flags).length >= 0) {
            const tobeAssigned = Object.keys(flags).map(
                (value: string, index) => {
                    if (value === 'improve_ai') {
                        response.privacy.improve_ai = flags[value];
                        return;
                    }

                    return JSON.parse(flags[value]);
                },
                [],
            );

            _.merge(response.capabilities, ...tobeAssigned);

            response.name = args.name;
        }

        // if no flags or arguments provided, make interactive
        if (!args.name && Object.keys(flags).length === 0) {
            const general = await prompt([
                {
                    type: 'text',
                    name: 'name',
                    message: `Application Name`,
                    initial: shortName,
                },
                {
                    type: 'multiselect',
                    name: 'selected_capabilities',
                    message: 'Select App Capabilities',
                    choices: [
                        { title: 'Voice', value: 'voice' },
                        { title: 'Messages', value: 'messages' },
                        { title: 'RTC', value: 'rtc' },
                        { title: 'VBC', value: 'vbc' },
                    ],
                    hint: '- Space to select. Return to submit',
                },
            ]);
            response = Object.assign({}, response, general);

            if (response.selected_capabilities?.indexOf('voice') > -1) {
                response.capabilities.voice = {};
                let answerUrl;
                let eventUrl;

                const voice = await prompt({
                    type: 'confirm',
                    name: 'voice_webhooks_confirm',
                    message: 'Create voice webhooks?',
                });

                if (voice.voice_webhooks_confirm) {
                    answerUrl = await webhookQuestions({
                        name: 'Answer Webhook',
                    });
                    eventUrl = await webhookQuestions({
                        name: 'Event Webhook',
                    });
                } else {
                    answerUrl = {
                        address: 'https://www.sample.com/webhook/answerUrl',
                    };
                    eventUrl = {
                        address: 'https://www.sample.com/webhook/eventUrl',
                    };
                }

                response.capabilities.voice = {
                    webhooks: { answer_url: answerUrl, event_url: eventUrl },
                };
            }

            if (response.selected_capabilities?.indexOf('messages') > -1) {
                response.capabilities.messages = {};
                let inboundUrl;
                let statusUrl;
                const messages = await prompt({
                    type: 'confirm',
                    name: 'webhooks_confirm',
                    message: 'Create messages webhooks?',
                });

                if (messages.webhooks_confirm) {
                    inboundUrl = await webhookQuestions({
                        name: 'Inbound Message Webhook',
                    });
                    statusUrl = await webhookQuestions({
                        name: 'Status Webhook',
                    });
                } else {
                    inboundUrl = {
                        address: 'https://www.sample.com/webhook/inboundUrl',
                    };
                    statusUrl = {
                        address: 'https://www.sample.com/webhook/statusUrl',
                    };
                }
                response.capabilities.messages = {
                    webhooks: {
                        status_url: statusUrl,
                        inbound_url: inboundUrl,
                    },
                };
            }

            if (response.selected_capabilities?.indexOf('rtc') > -1) {
                response.capabilities.rtc = {};
                let eventUrl;

                const rtc = await prompt({
                    type: 'confirm',
                    name: 'webhooks_confirm',
                    message: 'Create RTC webhook?',
                });

                if (rtc.webhooks_confirm) {
                    eventUrl = await webhookQuestions({
                        name: 'Event Webhook',
                    });
                } else {
                    eventUrl = {
                        address: 'https://www.sample.com/webhook/rtc_eventUrl',
                    };
                }

                response.capabilities.rtc = {
                    webhooks: {
                        event_url: eventUrl,
                    },
                };
            }

            if (response.selected_capabilities?.indexOf('vbc') > -1) {
                response.capabilities.vbc = {};
            }

            delete response.selected_capabilities;

            const improveAi = await prompt({
                type: 'confirm',
                name: 'improveAi',
                message: `Allow use of data for AI training? Read data collection disclosure - ${kbArticle}`,
            });

            response.privacy = improveAi;
        }

        cli.action.start(chalk.bold('Creating Application'), 'Initializing', {
            stdout: true,
        });

        // create application
        const output = await this.createApplication(response);

        const keyFileName = sanitizeFileName(output.name);

        // write vonage.app file
        const vonageAppFilePath = `${process.cwd()}/vonage_app.json`;
        const vonagePrivateKeyFilePath = `${process.cwd()}/${keyFileName.toLowerCase()}.key`;

        writeFileSync(
            vonageAppFilePath,
            JSON.stringify(
                {
                    application_name: output.name,
                    application_id: output.id,
                    private_key: output.keys.private_key,
                },
                null,
                2,
            ),
        );

        writeFileSync(vonagePrivateKeyFilePath, output.keys.private_key);

        cli.action.stop();

        const indent = '  ';

        this.log(
            chalk.magenta.underline.bold('Application Name:'),
            output.name,
        );
        this.log('');
        this.log(chalk.magenta.underline.bold('Application ID:'), output.id);
        this.log('');

        const { voice, messages, rtc, vbc } = output.capabilities;

        if (voice) {
            this.log(chalk.magenta.underline.bold('Voice Settings'));

            this.log(indent, chalk.cyan.underline.bold('Event Webhook:'));
            this.log(
                indent,
                indent,
                chalk.bold('Address:'),
                _.get(voice, 'webhooks.event_url.address'),
            );
            this.log(
                indent,
                indent,
                chalk.bold('HTTP Method:'),
                _.get(voice, 'webhooks.event_url.http_method'),
            );

            this.log(indent, chalk.cyan.underline.bold('Answer Webhook:'));
            this.log(
                indent,
                indent,
                chalk.bold('Address:'),
                _.get(voice, 'webhooks.answer_url.address'),
            );
            this.log(
                indent,
                indent,
                chalk.bold('HTTP Method:'),
                _.get(voice, 'webhooks.answer_url.http_method'),
            );
            this.log('');
        }

        if (messages) {
            this.log(chalk.magenta.underline.bold('Messages Settings'));

            this.log(indent, chalk.cyan.underline.bold('Inbound Webhook:'));
            this.log(
                indent,
                indent,
                chalk.bold('Address:'),
                _.get(messages, 'webhooks.inbound_url.address'),
            );
            this.log(
                indent,
                indent,
                chalk.bold('HTTP Method:'),
                _.get(messages, 'webhooks.inbound_url.http_method'),
            );

            this.log(indent, chalk.cyan.underline.bold('Status Webhook:'));
            this.log(
                indent,
                indent,
                chalk.bold('Address:'),
                _.get(messages, 'webhooks.status_url.address'),
            );
            this.log(
                indent,
                indent,
                chalk.bold('HTTP Method:'),
                _.get(messages, 'webhooks.status_url.http_method'),
            );
            this.log('');
        }

        if (rtc) {
            this.log(chalk.magenta.underline.bold('RTC Settings'));

            this.log(indent, chalk.cyan.underline.bold('Event Webhook:'));
            this.log(
                indent,
                indent,
                chalk.bold('Address:'),
                _.get(rtc, 'webhooks.event_url.address'),
            );
            this.log(
                indent,
                indent,
                chalk.bold('HTTP Method:'),
                _.get(rtc, 'webhooks.event_url.http_method'),
            );
            this.log('');
        }

        if (vbc) {
            this.log(chalk.magenta.underline.bold('VBC Settings'));
            this.log(chalk.bold('Enabled'));
            this.log('');
        }

        this.log(chalk.magenta.underline.bold('Public Key'));
        this.log(output.keys.public_key);
        this.log('');

        this.log(chalk.magenta.underline.bold('App Files'));
        this.log(chalk.bold('Vonage App File:'), vonageAppFilePath);
        this.log('');
        this.log(chalk.bold('Private Key File:'), vonagePrivateKeyFilePath);
        this.log('');

        this.log(
            chalk.magenta.underline.bold('Improve AI:'),
            output.privacy.improve_ai,
        );

        this.log('');

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
