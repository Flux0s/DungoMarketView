import fs from 'fs';

interface DISCORD_MESSAGE {
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

enum ITEM_NAMES {
    bf_cannon = "BF Cannon",
    berserkers_armor = "Berserkers Armor",
    chumby_chicken = "Chumby Chicken",
    cleansing_flames = "Cleansing Flames",
    curseof_exhaustion = "Curse of Exhaustion",
    dark_ritual = "Dark Ritual",
    draining_dagger = "Draining Dagger",
    fiery_thorns = "Fiery Thorns",
    fire_sword = "Fire Sword",
    halberd = "Halberd",
    healing_pendant = "Healing Pendant",
    love_letter = "Love Letter",
    magic_parasol = "Magic Parasol",
    martyr_armor = "Martyr Armor",
    mocking_armor = "Mocking Armor",
    muddy_shell = "Muddy Shell",
    pet_imp = "Pet Imp",
    poison_dagger = "Poison Dagger",
    riot_shield = "Riot Shield",
    rock_companion = "Rock Companion",
    sacrificial_tome = "Sacrificial Tome",
    seeking_missiles = "Seeking Missiles",
    special_delivery = "Special Delivery",
    survival_kit = "Survival Kit",
    whirlwind_axeicon = "Whirlwind Axe icon",
    witchs_armor = "Witchs Armor",
    big_club = "Big Club",
    boosting_bugle = "Boosting Bugle",
    challenger_arrow = "Challenger Arrow",
    energetic_ally = "Energetic Ally",
    explosion_powder = "Explosion Powder",
    festive_feast = "Festive Feast",
    freezing_popsicle = "Freezing Popsicle",
    knights_lance = "Knights Lance",
    pogable_forge = "POGable Forge",
    plague_bringer = "Plague Bringer",
    punching_bag = "Punching Bag",
    red_cape = "Red Cape",
    the_box = "The BOX",
}

type ITEM_LISTING = {
    id: string;
    timestamp: Date;
    rarity: RARITY | null;
    name: string;
    tier: number;
    price: number;
}

type ITEM_SALE = {
    id: string;
    timestamp: string;
    rarity: RARITY | null;
    name: string;
    tier: number;
    price: number;
}

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

function parse_entry_descriptions(har_entry: HAR_ENTRY): { sellings: ITEM_SALE[], listings: ITEM_LISTING[] } {
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
    return { sellings: item_sales, listings: item_listings };
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
        const { sellings: entry_sales, listings: entry_listings } = parse_entry_descriptions(har_entry);
        all_sales.push(...entry_sales);
        all_listings.push(...entry_listings);
    }
    // console.log(all_listings);
    console.log(all_sales);
}

main();
