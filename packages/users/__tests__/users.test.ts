import { expect, test } from '@oclif/test';
import { promises as fs } from 'fs';

export const appFileData = {
    application_name: 'Test App File',
    application_id: '1234-5678-abcd-efgh',
    private_key:
        '-----BEGIN PRIVATE KEY-----not a real key----END PRIVATE KEY-----\n',
};

describe('users vonage_app.json file checks', () => {
    before(async () => {
        try {
            await fs.unlink('vonage_app.json');
        } catch (error) {
            console.error(error);
        }
    });

    after(async () => {
        try {
            await fs.writeFile(
                'vonage_app.json',
                JSON.stringify(appFileData, null, 2),
            );
        } catch (error) {
            console.error(error);
        }
    });

    test.env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
        .stdout()
        .command(['apps:users'])
        .it('should gracefully fail if no app file', (ctx) => {
            expect(ctx.stdout).to.equal(
                `Please create an application or a vonage_app.json file to proceed.\n`,
            );
        });
});
