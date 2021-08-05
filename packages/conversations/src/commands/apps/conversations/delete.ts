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

        let response = await this.deleteConversation(args.conversationID);

        this.log(`Conversation ${chalk.bold(args.conversationID)} deleted.`)

    }
}