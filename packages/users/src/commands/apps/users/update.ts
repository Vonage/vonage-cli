import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';

export default class Usersupdate extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    async run() {
        this.updateUser();
    }
}

// requires id
// response
// {
//     "name": "my_user_name",
//     "display_name": "My User Name",
//     "image_url": "https://example.com/image.png",
//     "channels": {
//       "type": "phone",
//       "leg_id": "a595959595959595995",
//       "from": "string",
//       "to": "string",
//       "leg_ids": [
//         {
//           "leg_id": "a595959595959595995"
//         }
//       ]
//     }
//   }