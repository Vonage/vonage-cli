import VonageCommand from '@vonage/cli-utils';
import { Flags } from '@oclif/core';
import { readFileSync } from 'fs';

export default class GenerateJWT extends VonageCommand<typeof GenerateJWT> {
    static description = 'generate a Vonage JWT token';

    static examples = [
        `jwt --key_file='./testing.key' --app_id=31521081-e4c7-41fe-bccc-44af98879068`,
    ];

    static flags = {
        app_id: Flags.string({
            required: true,
            description: 'Application ID to authenticate with',
        }),
        key_file: Flags.string({
            required: true,
            description: 'Path to private key file location',
        }),
        subject: Flags.string({
            required: false,
        }),
        acl: Flags.string({
            required: false,
            description: `Read more about it in the ACL overview - https://developer.vonage.com/conversation/guides/jwt-acl#acls`,
        }),
        exp: Flags.string({
            required: false,
            description: 'Expiration of created JWT - defaults to 24 hours.',
        }),
    };

    static args = [];

    async run() {
        const flags = this.parsedFlags;
        // prettier-ignore
        const privateKey = typeof flags.key_file === 'string'
            ? readFileSync(flags.key_file.replace(/(\s+)/g, '\\$1'))
            : null;
        const claims = {
            application_id: flags.app_id,
            sub: flags.subject,
            exp: flags.exp || Date.now() + 21600,
        };

        flags.acl ? (claims['acl'] = JSON.parse(flags.acl.toString())) : null;

        const jwt = this.Vonage.generateJwt(privateKey, claims);

        this.log(jwt);
        this.exit();
    }
}
