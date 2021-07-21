import BaseCommand from '@vonage/cli-utils';


export default abstract class ConversationsCommand extends BaseCommand {
    static flags = {
        ...BaseCommand.flags,
    };

    static args = [
        ...BaseCommand.args,
    ];

    getAllUsers(): any { }
    getUserById(): any { }
    createUser(): any { }
    updateUser(): any { }
    deleteUser(): any { }

}
