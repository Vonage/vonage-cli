import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';

export default class ConversationShow extends ConversationCommand {
    static description = "Show conversation details"

    static examples = [
    ]

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false }
    ]

    async run() {
        const args = this.parsedArgs!;

        let response = await this.getConversationById(args.conversationID);
        // fix:  undefined displays

        this.log(chalk.magenta.underline.bold("User ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name || ""})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url || "None")
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), response.data.timestamp.created) // use moment here
        this.log('')
    }
}