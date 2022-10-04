import { prompt } from 'prompts';
import { filenamifyPath } from 'filenamify';

interface WebhookQuestions {
    name: string;
    url?: string;
    method?: string;
}

// address needs to be verified as a valid http address before proceeding

export async function webhookQuestions({
    name,
    url = 'https://example.com/webhook_name',
    method = 'POST',
}: WebhookQuestions) {
    return await prompt([
        {
            type: 'text',
            name: 'address',
            message: `${name} - URL`,
            initial: url,
        },
        {
            type: 'select',
            name: 'http_method',
            message: `${name} - Method`,
            choices: [
                { title: 'GET', value: 'GET' },
                { title: 'POST', value: 'POST' },
            ],
            initial: method === 'POST' ? 1 : 0,
        },
    ]);
}

export function sanitizeFileName(filename, replacement = '_') {
    return filenamifyPath(filename, { replacement: replacement });
}
