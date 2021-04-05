import { AppCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
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
    messages_status_url: any,
    rtc_event_url: any,
    rtc_event_http: any,
    vbc: any
}

export default class ApplicationsUpdate extends AppCommand {
    static description = 'update a Vonage application'

    static examples = []

    static flags: OutputFlags<typeof AppCommand.flags> & UpdateFlags = {
        ...AppCommand.flags,
        'voice_answer_url': flags.string({
            description: 'Voice Answer Webhook URL Address',
            parse: input => `{"voice": {"webhooks": {"answer_url": {"address": "${input}"}}}}`
        }),
        'voice_answer_http': flags.string({
            description: 'Voice Answer Webhook HTTP Method',
            options: ['GET', 'POST'],
            dependsOn: ['voice_answer_url'],
            parse: input => `{"voice": {"webhooks": {"answer_url": {"method": "${input}"}}}}`
        }),
        'voice_event_url': flags.string({
            description: 'Voice Event Webhook URL Address',
            parse: input => `{"voice": {"webhooks": {"event_url": {"address": "${input}"}}}}`
        }),
        'voice_event_http': flags.string({
            description: 'Voice Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            dependsOn: ['voice_event_url'],
            parse: input => `{"voice": {"webhooks": {"event_url": {"method": "${input}"}}}}`
        }),
        'messages_inbound_url': flags.string({
            description: 'Messages Inbound Webhook URL Address',
            parse: input => `{"messages": {"webhooks": {"inbound_url": {"address": "${input}"}}}}`
        }),
        'messages_status_url': flags.string({
            description: 'Messages Status Webhook URL Address',
            parse: input => `{"messages": {"webhooks": {"status_url": {"address": "${input}"}}}}`
        }),
        'rtc_event_url': flags.string({
            description: 'RTC Event Webhook URL Address',
            parse: input => `{"rtc": {"webhooks": {"event_url": {"address": "${input}"}}}}`
        }),
        'rtc_event_http': flags.string({
            description: 'RTC Event Webhook HTTP Method',
            options: ['GET', 'POST'],
            dependsOn: ['rtc_event_url'],
            parse: input => `{"rtc": {"webhooks": {"event_url": {"method": "${input}"}}}}`
        }),
        'vbc': flags.boolean({
            description: 'VBC Capabilities Enabled',
        }),

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

    // TODO - adding capabilities works, removing them currently not - needs to be addressed
    // due to the merge method - find a better way to do this.
    // TODO - make sure current data is getting passed for webhook questions

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;


    }

}
