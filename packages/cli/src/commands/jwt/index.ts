import BaseCommand from '@vonage/cli-utils';
import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser';
import { readFileSync } from 'fs';



interface GenerateJWTFlags {
    app_id: any,
    key_file: any,
    subject?: any,
    acl?: any,
    exp?: any
}


export default class GenerateJWT extends BaseCommand<typeof GenerateJWT.flags> {

    static description = 'generate a Vonage JWT token'

    static examples = [
        `jwt --key_file='./testing.key' --app_id=31521081-e4c7-41fe-bccc-44af98879068`
    ]

    static flags: OutputFlags<typeof BaseCommand.flags> & GenerateJWTFlags = {
        ...BaseCommand.flags,
        app_id: flags.string({
            required: true,
            description: "Application ID to authenticate with"
        }),
        key_file: flags.string({
            required: true,
            description: "Path to private key file location"
        }),
        subject: flags.string({
            required: false,
        }),
        acl: flags.string({
            required: false,
            description: `Read more about it in the ACL overview - https://developer.vonage.com/conversation/guides/jwt-acl#acls`,
        }),
        exp: flags.string({ required: false, description: "Expiration of created JWT - defaults to 24 hours." }),
    }

    static args = [
    ]

    async run() {
        const flags = this.parsedFlags;
        let private_key = typeof flags.key_file === 'string' ? readFileSync(flags.key_file.replace(/(\s+)/g, '\\$1')) : null;
        let claims = {
            application_id: flags.app_id,
            sub: flags.subject,
            exp: flags.exp || Date.now() + 21600
        }

        flags.acl ? claims['acl'] = JSON.parse(flags.acl.toString()) : null;

        let jwt = this.Vonage.generateJwt(private_key, claims)

        this.log(jwt)
        this.exit()

    }
}