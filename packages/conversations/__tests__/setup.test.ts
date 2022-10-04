import { promises as fs } from 'fs';

export const appFileData = {
    application_name: 'Test App File',
    application_id: '1234-5678-abcd-efgh',
    private_key:
        '-----BEGIN PRIVATE KEY-----not a real key----END PRIVATE KEY-----\n',
};

export async function mochaGlobalSetup() {
    try {
        await fs.writeFile(
            'vonage_app.json',
            JSON.stringify(appFileData, null, 2),
        );
        console.log('Temp app file created');
    } catch (error) {
        console.error(error);
    }

    // set up prism
}

export async function mochaGlobalTeardown() {
    try {
        await fs.unlink('vonage_app.json');
        console.log('Temp app file deleted');
    } catch (error) {
        console.error(error);
    }
}
