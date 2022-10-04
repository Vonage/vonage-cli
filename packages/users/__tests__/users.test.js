import tslibOne from 'tslib';
import testOne from '@oclif/test';
import fsOne from 'fs';

exports.appFileData = {
    application_name: 'Test App File',
    application_id: '1234-5678-abcd-efgh',
    private_key:
        '-----BEGIN PRIVATE KEY-----not a real key----END PRIVATE KEY-----\n',
};

// eslint-disable-next-line no-undef
describe('users vonage_app.json file checks', () => {
    // eslint-disable-next-line no-undef
    beforeEach(() =>
        tslibOne.__awaiter(void 0, void 0, void 0, function* () {
            try {
                yield fsOne.promises.unlink('vonage_app.json');
            } catch (error) {
                console.error(error);
            }
        }),
    );
    // eslint-disable-next-line no-undef
    afterEach(() =>
        tslibOne.__awaiter(void 0, void 0, void 0, function* () {
            try {
                yield fsOne.promises.writeFile(
                    'vonage_app.json',
                    JSON.stringify(exports.appFileData, null, 2),
                );
            } catch (error) {
                console.error(error);
            }
        }),
    );
    testOne.test
        .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
        .stdout()
        .command(['apps:users'])
        .it('should gracefully fail if no app file', (ctx) => {
            (0, testOne.expect)(ctx.stdout).to.equal(
                `Please create an application or a vonage_app.json file to proceed.\n`,
            );
        });
});
