import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';

export default class ConversationDelete extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
        { name: 'conversationID', required: false },
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        // validate proper response
        let response = await this.deleteConversation(args.conversationID);
        if (response.status === 204) {
            this.log(`Conversation ${chalk.bold(args.conversationID)} deleted.`)
        }

    }
}