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

export default class ConversationUpdate extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & IndexFlags = {
        ...ConversationCommand.flags,
        'date_start': flags.string({ description: '' }), // make defaults
        'date_end': flags.string({ description: '' }),
        'page_size': flags.string({ description: '' }),
        'order': flags.string({ description: '' }),
        'cursor': flags.string({ description: '' }),
    }

    static args = [
        ...ConversationCommand.args,
        { name: 'userID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getConversationsByUser({ ...args, ...flags });

        let conversationsList = response.data._embedded.conversations;

        cli.table(conversationsList, {
            id: {},
            name: {},
            display_name: {},
            image_url: {}
        }, {
            ...flags
        })
    }
}