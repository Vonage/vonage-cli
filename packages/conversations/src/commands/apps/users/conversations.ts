import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import { ArgInput } from '@oclif/core/lib/interfaces';


export default class ConversationUpdate extends ConversationCommand<typeof ConversationUpdate.flags> {
    static description = ""

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags,
        'date_start': flags.string({ description: '' }), // make defaults
        'date_end': flags.string({ description: '' }),
        'page_size': flags.string({ description: '' }),
        'order': flags.string({ description: '' }),
        'cursor': flags.string({ description: '' }),
    }

    static args: ArgInput = [
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

    async catch(error: any) {
        return super.catch(error.response);
    }
}