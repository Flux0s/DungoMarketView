# Dungo Market View

## Background

BoxBox Dungeon Server is a turn based Role Playing Game built in Discord and implemented through Discord bots. The server is designed to be a community-driven platform where players compete in parties of up to four players to reach the deepest floor of the dungeon, collecting items and currency along the way.

Adapted from the Discord tutorial channel:

> Items are tools that you might come across obtaining from dungeon runs or even the marketplace.

> There are a total of 39 items (28 normal items and 11 ultimate items). You can only equip 3 normal items and 1 ultimate item at all times.
> Each item provides unique value to your player. Normal items are mainly passive or attack abilities, while ultimate items are high cooldown, game changing abilities.

> The Items are also labelled with tiers and rarity. The available rarities at this moment are ⚪ Common, 🟢 Uncommon, 🔵 Rare, 🟣 Epic, and 🟠 legendary (with common being the lowest and rare being highest level)

> Item tiers go from 1 to 9, with teir 9 items being the most powerful. To level up tiers, you combine two identical items of the same tier to give you a more powerful version of that item. (Example: `(2x) ⚪ Love Letter 1` can be combined into a `⚪ Love Letter 2`). Thus the chart below shows how many tier 1 items you will need to create one of that tier. Items cannot be converted to another rarity.

| Tier | # Tier 1's Needed |
| ---- | ----------------- |
| 1    | 1                 |
| 2    | 2                 |
| 3    | 4                 |
| 4    | 8                 |
| 5    | 16                |
| 6    | 32                |
| 7    | 64                |
| 8    | 128               |
| 9    | 256               |

### The Market

Taken from the Discord tutorial channel:

> You will eventually start to accumulate items and coins as you progress through the dungeons floors.

> You could then start to sell, buy items as well as trade items for coins (vice versa), or trade items for items.

> To check your inventory, type /inventory view. Click the buttons on the bottom of your inventory screen to equip, unequip, sell, and recycle your items. Your inventory space limits at 50 (can be increased to 500 as a subscriber)

> Alternatively, there is a gacha option if you would like to roll for random items using coins in market price.

## Problem Statement

Because the implementation of the game UI is bounded by the limitations of Discord, the game UI is not user-friendly and does not provide a seamless experience for players. Specifically, it is dificult to determine at what price a given item should be listed on the marketplace.

## Description

This project aims to create a platform for maintaining, and monitoring market data exported from the BoxBox Dungeon Server. The platform provides a user-friendly interface for players to view and analyze market data and trends on the server. It will also provide tools for players to analyze market trends and make informed decisions about when to sell and recycle items.

### Key Features

- Parsing of market channel messages into usable listing data objects

### Future Development Roadmap

- Market data persistent storage
- Data visualization and analysis tools
  - Graphs showing item prices over time
    - Filtering / grouping by item rarity, type, and tier
  - Ability to compare prices to previous seasons
- Decide how to use authentication
  - Should we host a public server where users can login or allow users to maintain their own server and market data
- Enhance the user experience with better navigation and UI/UX
- Determine if there is a way to reasonably gather the market data in real-time
  - Possible solution: Create a discord bot to fetch the market data _(This may not be possible based on the rules of the server / official devs)_

## Project Frameworks

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

The following frameworks are used via Create T3 App:

- [Next.js](https://nextjs.org) - The React Framework for the Web
- [NextAuth.js](https://next-auth.js.org) - Authentication for Next.js
- [Prisma](https://prisma.io) - Auto-generated and type-safe query builder for Node.js & TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
