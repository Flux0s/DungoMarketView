import fs from "fs";
import { DISCORD_MESSAGE, HAR_ENTRY } from "./types/DiscordTypes";
import { ITEM_LISTING, RARITY, LISTING_TYPE } from "./types/DungoTypes";

// Rest of your code...
async function read_har_file(file_path: string) {
  const file_data = fs.readFileSync(file_path, "utf8");
  return JSON.parse(file_data);
}

async function fetch_discord_messages() {
  // This is a placeholder for the actual implementation to fetch messages from Discord
  // Since we don't have access to the actual endpoint details, we will simulate it with a mock HAR file path
  const har_file_path = "discord.com.har";
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

function parse_rarity_from_emoji(rarity_emoji: string): RARITY | null {
  switch (rarity_emoji) {
    case "⚪":
      return RARITY.Common;
    case "🟢":
      return RARITY.Uncommon;
    case "🔵":
      return RARITY.Rare;
    case "🟣":
      return RARITY.Epic;
    case "🟠":
      return RARITY.Legendary;
  }
  return RARITY.Unknown;
}
function parse_sale_description(description: string): {
  rarity: RARITY | null;
  name: string;
  tier: number;
  price: number;
} {
  const pattern = /(⚪|🟢|🔵|🟣|🟠) ([^\d]+) (\d) has just been sold for (\d+) coins!/;
  const match = description.match(pattern);

  if (!match) {
    throw new Error("Input string does not match expected format.");
  }
  return {
    rarity: parse_rarity_from_emoji(match[1] || "Unknown"),
    name: match[2] || "Unknown Item",
    tier: parseInt(match[3] || "-1", 10),
    price: parseInt(match[4] || "-1", 10),
  };
}

function parse_listing_description(description: string): {
  rarity: RARITY | null;
  name: string;
  tier: number;
  price: number;
} {
  const pattern =
    /(⚪|🟢|🔵|🟣|🟠) ([^\d]+) (\d) has just been listed in the marketplace for (\d+) coins!/;
  const match = description.match(pattern);

  if (!match) {
    throw new Error("Input string does not match expected format.");
  }
  return {
    rarity: parse_rarity_from_emoji(match[1] || "Unknown"),
    name: match[2] || "Unknown Item",
    tier: parseInt(match[3] || "-1", 10),
    price: parseInt(match[4] || "-1", 10),
  };
}

function parse_entry_descriptions(har_entry: HAR_ENTRY): {
  sales: ITEM_LISTING[];
  listings: ITEM_LISTING[];
} {
  const har_entry_messages: DISCORD_MESSAGE[] = JSON.parse(har_entry.response.content.text);
  const item_sales: ITEM_LISTING[] = [];
  const item_listings: ITEM_LISTING[] = [];
  for (const message of har_entry_messages) {
    for (const embed of message.embeds) {
      if (embed?.title?.toLowerCase().includes("sold")) {
        console.log(embed.description);
        const sale = parse_sale_description(embed.description);
        item_sales.push({
          id: message.id,
          timestamp: new Date(message.timestamp),
          ...sale,
          type: LISTING_TYPE.listing,
        });
      } else if (embed?.title?.toLowerCase().includes("listing")) {
        const listing = parse_listing_description(embed.description);
        item_listings.push({
          id: message.id,
          timestamp: new Date(message.timestamp),
          ...listing,
          type: LISTING_TYPE.listing,
        });
      }
    }
  }
  return { sales: item_sales, listings: item_listings };
}

async function main() {
  const har_entries = await parse_har_entries();
  let all_sales: ITEM_LISTING[] = [];
  let all_listings: ITEM_LISTING[] = [];
  for (const har_entry of har_entries) {
    const { sales, listings } = parse_entry_descriptions(har_entry);
    all_sales.push(...sales);
    all_listings.push(...listings);
  }
  console.log(all_sales);
  // console.log(all_listings);
}

main();
