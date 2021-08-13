import { OutputFlags } from '@oclif/parser';
import ConversationCommand from './conversations_base';

export default class ConversationMemberRemove extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false },
        { name: 'memberID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = this.removeMemberFromConversation({ ...args, ...flags });

        this.log(`Member ID ${args.memberID} was removed from ${args.conversationID}`);
    }
}