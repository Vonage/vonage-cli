import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../conversations_base';

export default class ConversationDelete extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    async run() {
        this.deleteConversation();
    }
}

// response 204