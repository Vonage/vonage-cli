import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';

export default class UsersDefault extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    async run() {
        this.getAllUsers();
    }
}

//page_size, order, cursor

// response
// {
//     "page_size": 10,
//     "_embedded": {
//       "users": [
//         {
//           "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
//           "name": "my_user_name",
//           "display_name": "My User Name",
//           "_links": {
//             "self": {
//               "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
//             }
//           }
//         }
//       ]
//     },
//     "_links": {
//       "first": {
//         "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10"
//       },
//       "self": {
//         "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//       },
//       "next": {
//         "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//       },
//       "prev": {
//         "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
//       }
//     }
//   }