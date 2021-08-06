import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../../conversations_base';

export default class ConversationMemberRemove extends ConversationCommand {
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

        let response = this.removeMemberFromConversation({ ...args, ...flags });

        this.log(`Member ID ${args.memberID} was removed from ${args.conversationID}`);
    }
}

// response 
const apiresponse = {
    "state": "joined",
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
    }
}