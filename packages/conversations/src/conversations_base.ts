import BaseCommand from '@vonage/cli-utils';


export default abstract class ConversationsCommand extends BaseCommand {
    static flags = {
        ...BaseCommand.flags,
    };

    static args = [
        ...BaseCommand.args,
    ];

    getAllConversations(): any { }
    createConversation(): any { }
    getConversationById(): any { }
    updateConversation(): any { }
    deleteConversation(): any { }

    getConversationsByUser(): any { }

    getAllMembersInConversation(): any { }
    getMemberById(): any { }
    addMemberToConversation(): any { }
    removeMemberFromConversation(): any { }
}
