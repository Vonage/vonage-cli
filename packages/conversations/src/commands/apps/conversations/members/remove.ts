import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../../conversations_base';

export default class ConversationMemberRemove extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    async run() {
        this.removeMemberFromConversation();
    }
}

// response 
// {
//     "state": "joined",
//     "channel": {
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