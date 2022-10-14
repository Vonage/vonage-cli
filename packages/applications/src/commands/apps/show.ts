import AppCommand from '../../app_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import _ from 'lodash';
import { CliUx } from '@oclif/core';


export default class ApplicationsShow
    extends AppCommand<typeof ApplicationsShow> {
    static description = 'show Vonage application details';

    static examples = [];

    static args: ArgInput = [{ name: 'appId', required: false }];

    setQuestions(list: any) {
        return list.map((application: any) => {
            return {
                title: `${application.name} | ${application.id}`,
                value: application.id,
            };
        });
    }

    async run() {
        const args = this.parsedArgs!;
        let response = args;

        if (!args.appId) {
            response = await CliUx.ux.prompt(
                'Your Applications',
                {
                    required: true,
                },
            );
        }

        const output = await this.getSingleApplication(response.appId);
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
                _.get(messages, 'messages.status_url.http_method'),
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
                _.get(rtc, 'messages.event_url.http_method'),
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

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}
