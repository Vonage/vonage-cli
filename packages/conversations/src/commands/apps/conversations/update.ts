import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';

interface UpdateFlags {
    name: any
    display_name: any
    image_url: any
    ttl: any
}

export default class UserConversations extends ConversationCommand {
    static description = "Modify a conversation"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & UpdateFlags = {
        ...ConversationCommand.flags,
        'name': flags.string({ description: '' }),
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
        'ttl': flags.string({ description: '' }),
    }

    static args = [
        { name: 'conversationID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;
        let update = await this.updateConversation({ ...args, ...flags });
        let response = await this.getConversationById(args.conversationID);

        this.log(chalk.magenta.underline.bold("Conversation ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name || ""})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url || "None")
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state || "None")
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), response.data.timestamp.created) // use moment here
        this.log('')
    }
}