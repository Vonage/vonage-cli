import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

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
        'date_start': flags.string({ description: '', hidden: true }), // make defaults
        'date_end': flags.string({ description: '', hidden: true }),
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv', 'extended', 'no-header']
        })
    }

    static args = []

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getAllConversations(flags) as VetchResponse;

        let conversationsList = response.data?._embedded.conversations;

        cli.table(conversationsList, {
            id: {},
            name: {},
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