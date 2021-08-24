import { prompt } from 'prompts';

interface WebhookQuestions {
    name: string
    url?: string
    method?: string
}

// address needs to be verified as a valid http address before proceeding

export async function webhookQuestions({ name, url = 'https://example.com/webhook_name', method = 'POST' }: WebhookQuestions) {
    return await prompt([{
        type: 'text',
        name: 'address',
        message: `${name} - URL`,
        initial: url
    },
    {
        type: 'select',
        name: 'http_method',
        message: `${name} - Method`,
        choices: [
            { title: 'GET', value: 'GET' },
            { title: 'POST', value: 'POST' }
        ],
        initial: method === 'POST' ? 1 : 0
    }])

}

export function sanitizeFileName(filename, replacement = "_") {
    let illegalRe = /[\/\?<>\\:\*\|":]/g;
    let controlRe = /[\x00-\x1f\x80-\x9f]/g;
    let reservedRe = /^\.+$/;
    let alphanumbericRe = /[^a-z0-9]/ig
    let windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

    let sanitized = filename
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(alphanumbericRe, replacement);

    return sanitized;
}
