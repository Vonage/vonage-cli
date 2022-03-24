import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default class ConversationShow extends ConversationCommand<typeof ConversationShow.flags> {
    static description = "Show conversation details"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags,
        /* ... */
    };

    static args: ArgInput = [
        { name: 'conversationID', required: false }
    ]

    async run() {
        const args = this.parsedArgs!;

        let response = await this.getConversationById(args.conversationID);

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
        return super.catch(error.response);
    }
}