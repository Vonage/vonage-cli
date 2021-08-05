import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';

interface IndexFlags {
    date_start: any
    date_end: any
    page_size: any
    order: any
    cursor: any
}

export default class ConversationDefault extends ConversationCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & IndexFlags = {
        ...ConversationCommand.flags,
        'date_start': flags.string({ description: '' }), // make defaults
        'date_end': flags.string({ description: '' }),
        'page_size': flags.string({ description: '' }),
        'order': flags.string({ description: '' }),
        'cursor': flags.string({ description: '' }),
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv', 'extended', 'no-header']
        })
    }

    static args = []

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getAllConversations(flags);

        let conversationsList = apiresponse._embedded.conversations;

        cli.table(conversationsList, {
            id: {},
            name: {},
            display_name: {},
            image_url: {}
        }, {
            ...flags
        })

        this.exit();
    }
}

//response
const apiresponse = {
    "page_size": 10,
    "_embedded": {
        "conversations": [
            {
                "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
                "name": "customer_chat",
                "display_name": "Customer Chat",
                "image_url": "https://example.com/image.png",
                "timestamp": {
                    "created": "2019-09-03T18:40:24.324Z"
                },
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
                    }
                }
            },
            {
                "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
                "name": "customer_chat",
                "display_name": "Customer Chat",
                "image_url": "https://example.com/image.png",
                "timestamp": {
                    "created": "2019-09-03T18:40:24.324Z"
                },
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
                    }
                }
            },
            {
                "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
                "name": "customer_chat",
                "display_name": "Customer Chat",
                "image_url": "https://example.com/image.png",
                "timestamp": {
                    "created": "2019-09-03T18:40:24.324Z"
                },
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
                    }
                }
            },
            {
                "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
                "name": "customer_chat",
                "display_name": "Customer Chat",
                "image_url": "https://example.com/image.png",
                "timestamp": {
                    "created": "2019-09-03T18:40:24.324Z"
                },
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
                    }
                }
            },
            {
                "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
                "name": "customer_chat",
                "display_name": "Customer Chat",
                "image_url": "https://example.com/image.png",
                "timestamp": {
                    "created": "2019-09-03T18:40:24.324Z"
                },
                "_links": {
                    "self": {
                        "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
                    }
                }
            }
        ]
    },
    "_links": {
        "first": {
            "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10"
        },
        "self": {
            "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        },
        "next": {
            "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        },
        "prev": {
            "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
        }
    }
}