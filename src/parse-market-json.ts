import fs from 'fs';
import { DISCORD_MESSAGE, HAR_ENTRY } from './types/DiscordTypes';
import { ITEM_LISTING, ITEM_SALE, RARITY, ITEM_NAMES } from './types/DungoTypes';

// Rest of your code...
async function read_har_file(file_path: string) {
    const file_data = fs.readFileSync(file_path, 'utf8');
    return JSON.parse(file_data);
}

async function fetch_discord_messages() {
    // This is a placeholder for the actual implementation to fetch messages from Discord
    // Since we don't have access to the actual endpoint details, we will simulate it with a mock HAR file path
    const har_file_path = 'discord.com.har';
    const har_data = await read_har_file(har_file_path);
    return har_data;
}

async function parse_har_entries() {
    const messages: HAR_ENTRY[] = [];
    const har_data = await fetch_discord_messages();
    if (har_data && har_data.log && har_data.log.entries) {
        for (const entry of har_data.log.entries) {
            if (entry.request && entry.response) {
                messages.push(entry);
            }
        }
    }
    return messages;
}

function parse_entry_descriptions(har_entry: HAR_ENTRY): { sales: ITEM_SALE[], listings: ITEM_LISTING[] } {
    const har_entry_messages: DISCORD_MESSAGE[] = JSON.parse(har_entry.response.content.text);
    const item_sales: ITEM_SALE[] = [];
    const item_listings: ITEM_LISTING[] = [];
    for (const message of har_entry_messages) {
        for (const embed of message.embeds) {
            if (embed?.title?.toLowerCase().includes("sold")) {
                item_sales.push(parse_sale_description(embed.description, message));
            } else if (embed?.title?.toLowerCase().includes("listing")) {
                parse_listing_description(embed.description);
            }
        }
    }
    return { sales: item_sales, listings: item_listings };
}

function parse_sale_description(description: string, message: DISCORD_MESSAGE): ITEM_SALE {
    const rarity = parse_rarity(description);
    const nameMatch = description.match(/\b[A-Za-z\s]+\b/);
    const tierMatch = description.match(/(?:tier|level)\s*(\d+)/i);
    const priceMatch = description.match(/(\d+)\s*coins/i);

    if (!rarity || !nameMatch || !tierMatch || !priceMatch) {
        throw new Error("Invalid sale description format");
    }

    const name = ITEM_NAMES[nameMatch[0].replace(/\s+/g, '_') as keyof typeof ITEM_NAMES];
    const tier = parseInt(tierMatch[1], 10);
    const price = parseInt(priceMatch[1], 10);

    return { id: message.id, timestamp: message.timestamp, rarity: rarity, name: name, tier: tier, price: price };
}

function parse_listing_description(description: string) {
    // listing description is of the format: "<item_rarity> <item_name> <item_tier> has just been listed in the marketplace for <item_price> coins!"
    console.log(description);
}


function parse_rarity(description: string): RARITY | null {
    const emojiMatch = description.match(/⚪|🟢|🔵|🟣|🟠/);
    if (emojiMatch) {
        switch (emojiMatch[0]) {
            case '⚪':
                return RARITY.Common;
            case '🟢':
                return RARITY.Uncommon;
            case '🔵':
                return RARITY.Rare;
            case '🟣':
                return RARITY.Epic;
            case '🟠':
                return RARITY.Legendary;
        }
    }
    return null;
}

async function main() {
    const har_entries = await parse_har_entries();
    let all_sales: ITEM_SALE[] = [];
    let all_listings: ITEM_LISTING[] = [];
    for (const har_entry of har_entries) {
        const { sales, listings } = parse_entry_descriptions(har_entry);
        all_sales.push(...sales);
        all_listings.push(...listings);
    }
    console.log(all_sales);
}

main();
