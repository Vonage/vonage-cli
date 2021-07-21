import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../conversations_base';

export default class ConversationUpdate extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    async run() {
        this.getConversationsByUser();
    }
}
// filters
// date_start, date_end, page_size, order, cursor

// requires user id

// reponse
// {
//     "page_size": 10,
//     "_embedded": {
//       "conversations": [
//         {
//           "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
//           "name": "customer_chat",
//           "display_name": "Customer Chat",
//           "image_url": "https://example.com/image.png",
//           "timestamp": {
//             "created": "2019-09-03T18:40:24.324Z"
//           },
//           "_links": {
//             "self": {
//               "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
//             }
//           }
//         }
//       ]
//     },
//     "_links": {
//       "self": {
//         "first": {
//           "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec/conversations?order=desc&page_size=10"
//         },
//         "self": {
//           "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//         },
//         "next": {
//           "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//         },
//         "prev": {
//           "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//         }
//       }
//     }
//   }