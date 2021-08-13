import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import cli from 'cli-ux';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

interface IndexFlags {
    page_size: any
    order: any
    cursor: any
}

export default class UsersDefault extends UserCommand {
    static description = ""

    static examples = [
    ]


    static flags: OutputFlags<typeof UserCommand.flags> & IndexFlags = {
        ...UserCommand.flags,
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
    }

    static args = []

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;
        let response = await this.getAllUsers(flags) as VetchResponse;
        let userData = response.data._embedded.users;

        cli.table(userData, {
            id: {},
            name: {}
        }, {
            ...flags
        });
        this.exit();
    }

}

//page_size, order, cursor

// response
const apiresponse: any = {
    "page_size": 10,
    "_embedded": {
        "users": [
            {
                "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
                "name": "my_user_name",
                "display_name": "My User Name",
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                    }
                }
            },
            {
                "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
                "name": "my_user_name",
                "display_name": "My User Name",
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                    }
                }
            },
            {
                "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
                "name": "my_user_name",
                "display_name": "My User Name",
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                    }
                }
            }, {
                "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
                "name": "my_user_name",
                "display_name": "My User Name",
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                    }
                }
            }, {
                "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
                "name": "my_user_name",
                "display_name": "My User Name",
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                    }
                }
            }
        ]
    },
    "_links": {
        "first": {
            "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10"
        },
        "self": {
            "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        },
        "next": {
            "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        },
        "prev": {
            "href": "https://api.nexmo.com/v0.3/users?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        }
    }
}