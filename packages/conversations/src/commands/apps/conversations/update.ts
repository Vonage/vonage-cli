import { flags } from '@oclif/command'
import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';


export default class UserConversations extends ConversationCommand<typeof UserConversations.flags> {
    static description = "Modify a conversation"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags,
        'name': flags.string({ description: '' }),
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
        'ttl': flags.string({ description: '' }),
    }

    static args: ArgInput = [
        { name: 'conversationID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.updateConversation({ ...args, ...flags });

        this.log(chalk.magenta.underline.bold("Conversation Display Name:"), response.data.name, `(${response.data.display_name || `''`})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Conversation ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), `'${response.data.image_url}'` || `'None'`)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
        this.log(chalk.magenta.underline.bold("Sequence Number:"), response.data.sequence_number)
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), response.data.timestamp.created)
        this.log('')
        this.log(chalk.magenta.underline.bold("Time to Live:"), response.data.properties.ttl)
        this.log('')
    }

    async catch(error: any) {
        console.log(error)
        return super.catch(error.response);
    }
}