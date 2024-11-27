"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const DungoTypes_1 = require("./types/DungoTypes");
// Rest of your code...
function read_har_file(file_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const file_data = fs_1.default.readFileSync(file_path, "utf8");
        return JSON.parse(file_data);
    });
}
function fetch_discord_messages() {
    return __awaiter(this, void 0, void 0, function* () {
        // This is a placeholder for the actual implementation to fetch messages from Discord
        // Since we don't have access to the actual endpoint details, we will simulate it with a mock HAR file path
        const har_file_path = "discord.com.har";
        const har_data = yield read_har_file(har_file_path);
        return har_data;
    });
}
function parse_har_entries() {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = [];
        const har_data = yield fetch_discord_messages();
        if (har_data && har_data.log && har_data.log.entries) {
            for (const entry of har_data.log.entries) {
                if (entry.request && entry.response) {
                    messages.push(entry);
                }
            }
        }
        return messages;
    });
}
function parse_rarity_from_emoji(rarity_emoji) {
    switch (rarity_emoji) {
        case "⚪":
            return DungoTypes_1.RARITY.Common;
        case "🟢":
            return DungoTypes_1.RARITY.Uncommon;
        case "🔵":
            return DungoTypes_1.RARITY.Rare;
        case "🟣":
            return DungoTypes_1.RARITY.Epic;
        case "🟠":
            return DungoTypes_1.RARITY.Legendary;
    }
    return null;
}
function parse_sale_description(description) {
    const pattern = /(⚪|🟢|🔵|🟣|🟠) ([^\d]+) (\d) has just been sold for (\d+) coins!/;
    const match = description.match(pattern);
    if (!match) {
        throw new Error("Input string does not match expected format.");
    }
    return {
        rarity: parse_rarity_from_emoji(match[1]),
        name: match[2],
        tier: parseInt(match[3], 10),
        price: parseInt(match[4], 10),
    };
}
function parse_listing_description(description) {
    const pattern = /(⚪|🟢|🔵|🟣|🟠) ([^\d]+) (\d) has just been listed in the marketplace for (\d+) coins!/;
    const match = description.match(pattern);
    if (!match) {
        throw new Error("Input string does not match expected format.");
    }
    return {
        rarity: parse_rarity_from_emoji(match[1]),
        name: match[2],
        tier: parseInt(match[3], 10),
        price: parseInt(match[4], 10),
    };
}
function parse_entry_descriptions(har_entry) {
    var _a, _b;
    const har_entry_messages = JSON.parse(har_entry.response.content.text);
    const item_sales = [];
    const item_listings = [];
    for (const message of har_entry_messages) {
        for (const embed of message.embeds) {
            if ((_a = embed === null || embed === void 0 ? void 0 : embed.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("sold")) {
                console.log(embed.description);
                const sale = parse_sale_description(embed.description);
                item_sales.push(Object.assign(Object.assign({ id: message.id, timestamp: new Date(message.timestamp) }, sale), { type: DungoTypes_1.LISTING_TYPE.listing }));
            }
            else if ((_b = embed === null || embed === void 0 ? void 0 : embed.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("listing")) {
                const listing = parse_listing_description(embed.description);
                item_listings.push(Object.assign(Object.assign({ id: message.id, timestamp: new Date(message.timestamp) }, listing), { type: DungoTypes_1.LISTING_TYPE.listing }));
            }
        }
    }
    return { sales: item_sales, listings: item_listings };
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const har_entries = yield parse_har_entries();
        let all_sales = [];
        let all_listings = [];
        for (const har_entry of har_entries) {
            const { sales, listings } = parse_entry_descriptions(har_entry);
            all_sales.push(...sales);
            all_listings.push(...listings);
        }
        console.log(all_sales);
        // console.log(all_listings);
    });
}
main();
