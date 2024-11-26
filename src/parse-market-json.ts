import fs from 'fs';

interface discordMessageFormat {
    type: string,
    content: string,
    mentions: any[],
    mention_roles: any[],
    attachments: any[],
    embeds: [
        {
            type: string,
            title: string,
            description: string,
            color: number,
            content_scan_version: number
        }
    ],
    timestamp: string,
    edited_timestamp: string,
    flags: string,
    components: any[],
    id: string,
    channel_id: string,
    author: {
        id: string,
        username: string,
        avatar: string,
        discriminator: string,
        public_flags: number,
        flags: number,
        bot: true,
        banner: any,
        accent_color: any,
        global_name: any,
        avatar_decoration_data: any,
        banner_color: any,
        clan: any,
        primary_guild: any
    },
    pinned: boolean,
    mention_everyone: boolean,
    tts: boolean
}

interface har_entry {
    request: {
        method: string;
        url: string;
        headers: Record<string, string>;
        bodySize: number;
        cookies: string[];
        postData?: {
            text: string;
        };
    };
    response: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        content: {
            size: number;
            mimeType: string;
            text: string;
        };
    };
}

async function readHarFile(filePath: string) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

async function fetchDiscordMessages() {
    // This is a placeholder for the actual implementation to fetch messages from Discord
    // Since we don't have access to the actual endpoint details, we will simulate it with a mock HAR file path
    const harFilePath = 'discord.com.har';
    const harData = await readHarFile(harFilePath);
    return harData;
}

async function displayMessages() {
    const messages: har_entry[] = [];
    const harData = await fetchDiscordMessages();
    if (harData && harData.log && harData.log.entries) {
        for (const entry of harData.log.entries) {
            if (entry.request && entry.response) {
                messages.push(entry);
            }
        }
    }
    return messages;
}

function parseMessageDescription(har_entry: har_entry): void {
    const har_entry_messages: discordMessageFormat[] = JSON.parse(har_entry.response.content.text);
    for (const message of har_entry_messages) {
        for (const embed of message.embeds) {
            if (embed.title && embed.title.toLowerCase().includes("sold")) {
                const emojiMatch = embed.description?.match(/⚪|🟢|🔵|🟣/);
                if (emojiMatch) {
                    const emoji = emojiMatch[0];
                    let itemName: string | null = null;
                    let price: number | null = null;
                    const descriptionParts = embed.description.split(' ');
                    for (let i = 1; i < descriptionParts.length; i++) {
                        const numMatch = descriptionParts[i].match(/^\d+$/);
                        if (numMatch) {
                            price = parseInt(numMatch[0], 10);
                            break;
                        } else {
                            itemName = descriptionParts[i];
                        }
                    }
                    if (itemName && price !== null) {
                        console.log(`Id: ${message.id}`);
                        console.log(`Timestamp: ${message.timestamp}`);
                        console.log(`${emoji} ${itemName} has just been sold for ${price} coins!`);
                    }
                }
            }
        }
    }
}

async function main() {
    const har_entries = await displayMessages();
    for (const har_entry of har_entries) {
        parseMessageDescription(har_entry);
    }
}
main();
