import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';

export default class UsersShow extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    async run() {
        this.getUserById();
    }
}

// requires id

// {
//     "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
//     "name": "my_user_name",
//     "display_name": "My User Name",
//     "image_url": "https://example.com/image.png",
//     "properties": {
//       "custom_data": {}
//     },
//     "channels": {},
//     "_links": {
//       "self": {
//         "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
//       }
//     }
//   }