import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../conversations_base';

export default class ConversationCreate extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    async run() {
        this.createConversation();
    }
}

// input
// {
//     "name": "customer_chat",
//     "display_name": "Customer Chat",
//     "image_url": "https://example.com/image.png",
//     "properties": {
//       "ttl": 60
//     }
//   }

// response
// {
//     "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
//     "name": "customer_chat",
//     "display_name": "Customer Chat",
//     "image_url": "https://example.com/image.png",
//     "state": "ACTIVE",
//     "sequence_number": 0,
//     "timestamp": {
//       "created": "2019-09-03T18:40:24.324Z"
//     },
//     "properties": {
//       "ttl": 60
//     },
//     "numbers": {},
//     "_links": {
//       "self": {
//         "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
//       }
//     }
//   }