export enum RARITY {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Epic = "epic",
  Legendary = "legendary",
}

export enum ITEM_NAMES {
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

export enum LISTING_TYPE {
  listing = "listing",
  sale = "sale",
}

export type ITEM_LISTING = {
  id: string;
  timestamp: Date;
  rarity: RARITY | null;
  name: string;
  tier: number;
  price: number;
  type: LISTING_TYPE;
};
