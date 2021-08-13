import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../../conversations_base';
import cli from 'cli-ux';

interface IndexFlags {
    page_size: any
    order: any
    cursor: any
}

export default class ConversationMemberDefault extends ConversationCommand {
    static description = "View all members in a conversation"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & IndexFlags = {
        ...ConversationCommand.flags,
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
    }

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getAllMembersInConversation({ ...args, ...flags });

        let membersList = response.data._embedded.members;

        cli.table(membersList, {
            id: {},
            state: {},
        }, {
            ...flags
        })

        this.exit();
    }
}