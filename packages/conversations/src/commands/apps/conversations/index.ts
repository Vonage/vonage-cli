import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';

interface IndexFlags {
    date_start: any
    date_end: any
    page_size: any
    order: any
    cursor: any
}

export default class ConversationDefault extends ConversationCommand {
    static description = "Show all conversations"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & IndexFlags = {
        ...ConversationCommand.flags,
        'date_start': flags.string({ description: '', hidden: true }), // make defaults
        'date_end': flags.string({ description: '', hidden: true }),
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
    }

    static args = []

    async run() {
        const flags = this.parsedFlags

        let response = await this.getAllConversations(flags);

        let conversationsList = response.data?._embedded.conversations;

        cli.table(conversationsList, {
            display_name: {
                header: 'Display Name',
                get: row => row ? '' : row
            },
            id: {
                header: 'ID'
            },
            name: {},
        }, {
            ...flags
        })
    }

    async catch(error: any) {
        return super.catch(error.response)
    }
}