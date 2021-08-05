import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';

export default class ConversationShow extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false }
    ]

    async run() {
        const args = this.parsedArgs!;

        let response = await this.getConversationById(args.conversationID);

        this.log(chalk.magenta.underline.bold("User ID:"), apiresponse.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), apiresponse.name, `(${apiresponse.display_name})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), apiresponse.image_url)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), apiresponse.image_url)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), apiresponse.state)
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), apiresponse.timestamp.created) // use moment here
        this.log('')
        this.log(chalk.magenta.underline.bold("TTL:"), apiresponse.properties.ttl, `(minutes remaining)`) // use moment here to get time remaining if > 0
        this.log('')
    }
}
// requires id
// response
const apiresponse = {
    "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
    "name": "customer_chat",
    "display_name": "Customer Chat",
    "image_url": "https://example.com/image.png",
    "state": "ACTIVE",
    "sequence_number": 0,
    "timestamp": {
        "created": "2019-09-03T18:40:24.324Z"
    },
    "properties": {
        "ttl": 60
    },
    "numbers": {},
    "_links": {
        "self": {
            "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
        }
    }
}