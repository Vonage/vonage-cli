import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

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

        let response = await this.getConversationById(args.conversationID) as VetchResponse;
        // fix:  undefined displays

        this.log(chalk.magenta.underline.bold("User ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), response.data.timestamp.created) // use moment here
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