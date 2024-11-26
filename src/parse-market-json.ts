import fs from 'fs';

interface DISCORD_MESSAGE_FORMAT {
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

interface HAR_ENTRY {
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

enum RARITY {
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Epic = 'epic',
    Legendary = 'legendary'
}

type ITEM_LISTING = {
    id: string;
    timestamp: string;
    rarity: RARITY | null;
    name: string;
    tier: number;
    // price: number;
}

type ITEM_SELLING = {
    id: string;
    timestamp: string;
    rarity: RARITY| null;
    name: string;
    tier: number;
    // price: number;
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
    const messages: HAR_ENTRY[] = [];
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

function parseMessageDescription(har_entry: HAR_ENTRY): { sellings: ITEM_SELLING[], listings: ITEM_LISTING[] } {
    const har_entry_messages: DISCORD_MESSAGE_FORMAT[] = JSON.parse(har_entry.response.content.text);
    const item_sellings: ITEM_SELLING[] = [];
    const item_listings: ITEM_LISTING[] = [];
    for (const message of har_entry_messages) {
        for (const embed of message.embeds) {
            const emojiMatch = embed.description?.match(/⚪|🟢|🔵|🟣|🟠/);
            let rarity: RARITY | null = null;
            if (emojiMatch) {
                switch (emojiMatch[0]) {
                    case '⚪':
                        rarity = RARITY.Common;
                        break;
                    case '🟢':
                        rarity = RARITY.Uncommon;
                        break;
                    case '🔵':
                        rarity = RARITY.Rare;
                        break;
                    case '🟣':
                        rarity = RARITY.Epic;
                        break;
                    case '🟠':
                        rarity = RARITY.Legendary;
                        break;
                }
            }
            let item_name: string | null = null;
            let item_tier: number | null = null;
            let item_price: number | null = null;
            const descriptionParts = embed.description.split(' ');
            for (let i = 1; i < descriptionParts.length; i++) {
                const numMatch = descriptionParts[i].match(/^\d+$/);
                if (numMatch) {
                    item_tier = parseInt(numMatch[0], 10);
                    break;
                } else {
                    item_name = descriptionParts[i];
                }
            }
            // console.log(embed.description)
            if (item_name && item_tier !== null) {
                if (embed?.title?.toLowerCase().includes("sold")) {
                    item_sellings.push({ id: message.id, timestamp: message.timestamp, rarity: rarity, name: item_name, tier: item_tier });
                } else if (embed?.title?.toLowerCase().includes("listing"))
                    item_listings.push({ id: message.id, timestamp: message.timestamp, rarity: rarity, name: item_name, tier: item_tier });
            }
        }
    }
    return { sellings: item_sellings, listings: item_listings };
}

async function main() {
    const har_entries = await displayMessages();
    for (const har_entry of har_entries) {
        let sellings: ITEM_SELLING[] = [];
        let listings: ITEM_LISTING[] = [];
        ({ sellings, listings } = parseMessageDescription(har_entry));
        console.log('Sellings:', sellings);
        console.log('Listings:', listings);
    }
}

main();
