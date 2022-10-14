import { CliUx, Flags } from '@oclif/core';
import ConversationCommand from '../../../conversations_base.js';
import { ArgInput } from '@oclif/core/lib/interfaces';

const cli = CliUx.ux;

export default class ConversationUpdate extends ConversationCommand<
    typeof ConversationUpdate.flags
> {
    static description = '';

    static examples = [];

    static flags = {
        ...ConversationCommand.flags,
        date_start: Flags.string({ description: '' }), // make defaults
        date_end: Flags.string({ description: '' }),
        page_size: Flags.string({ description: '' }),
        order: Flags.string({ description: '' }),
        cursor: Flags.string({ description: '' }),
    };

    static args: ArgInput = [{ name: 'userID', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;

        const response = await this.getConversationsByUser({
            ...args,
            ...flags,
        });

        const conversationsList = response.data._embedded.conversations;

        cli.table(
            conversationsList,
            {
                id: {},
                name: {},
                display_name: {},
                image_url: {},
            },
            {
                ...flags,
            },
        );
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}
