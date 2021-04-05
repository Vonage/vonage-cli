import { prompt } from 'prompts';

interface WebhookQuestions {
    name: string
    data?: object
    questions?: number
}

// address needs to be verified as a valid http address before proceeding

export async function webhookQuestions({ name, questions = 4, data = {} }: WebhookQuestions) {
    return await prompt([{
        type: 'text',
        name: 'address',
        message: `${name} - URL`,
        initial: 'https://example.com/webhook_name'
    },
    {
        type: 'select',
        name: 'http_method',
        message: `${name} - Method`,
        choices: [
            { title: 'GET', value: 'GET' },
            { title: 'POST', value: 'POST' }
        ]
    },
    {
        type: 'number',
        name: 'connection_timeout',
        message: `${name} - Connection Timeout`,
        initial: '1000',
        min: '300',
        max: '1000'
    },
    {
        type: 'number',
        name: 'socket_timeout',
        message: `${name} - Socket Timeout`,
        initial: '5000',
        min: '1000',
        max: '5000'
    }].slice(0, questions))

}