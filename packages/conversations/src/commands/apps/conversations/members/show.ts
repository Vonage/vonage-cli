import { OutputFlags } from '@oclif/parser';
import cli from 'cli-ux';
import chalk from 'chalk';
import ConversationCommand from '../../../../conversations_base';

export default class ConversationMemberShow extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false },
        { name: 'memberID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = this.getMemberById({ ...args, ...flags });

        this.log(chalk.magenta.underline.bold("Member ID:"), apiresponse.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("User ID:"), apiresponse._embedded.user.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("User Name:"), apiresponse._embedded.user.name)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), apiresponse.state)
        this.log('')
    }
}

// requires convo id and member id
// response

const apiresponse = {
    "id": "MEM-63f61863-4a51-4f6b-86e1-46edebio0391",
    "conversation_id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
    "_embedded": {
        "user": {
            "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
            "name": "my_user_name",
            "display_name": "My User Name",
            "_links": {
                "self": {
                    "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
                }
            }
        }
    },
    "state": "JOINED",
    "timestamp": {
        "invited": "2020-01-01T14:00:00.00Z",
        "joined": "2020-01-01T14:00:00.00Z",
        "left": "2020-01-01T14:00:00.00Z"
    },
    "initiator": {
        "joined": {
            "isSystem": true,
            "user_id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
            "member_id": "MEM-63f61863-4a51-4f6b-86e1-46edebio0391"
        }
    },
    "channel": {
        "type": "phone",
        "leg_id": "a595959595959595995",
        "from": "string",
        "to": "string",
        "leg_ids": [
            {
                "leg_id": "a595959595959595995"
            }
        ]
    },
    "media": {
        "audio_settings": {
            "enabled": false,
            "earmuffed": false,
            "muted": false
        }
    },
    "_links": {
        "href": "https://api.nexmo.com/v0.3/conversations/CON-63f61863-4a51-4f6b-86e1-46edebio0391/members/MEM-63f61863-4a51-4f6b-86e1-46edebio0391"
    }
}