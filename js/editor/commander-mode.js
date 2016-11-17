define( [ "codemirror", "codemirror/addon/mode/simple" ], function( CodeMirror ) {

  CodeMirror.defineSimpleMode( "commander", {
    start: [
      // Escaped characters
      { regex: /`.?/, token: "hr" },

      // Commander specific
      { regex: /(?:chain|include)\b/, token: "header", sol: true },
      { regex: /(\s*)(default|def|var)\b/, token: [ "quote", "header" ], sol: true },
      { regex: /(\s+)([01irc\?!]+)(:)/, token: [ null, "quote", "operator" ], sol: true },

      // Commander specific
      { regex: /\$\w+/, token: "variable" },
      { regex: /\^\w+/, token: "variable-2" },
      { regex: /\/\/.*/, token: "comment" },

      // Minecraft Specific
      { regex: /@[aepr]\b/, token: "string" },
      { regex: /(?:Item|XPOrb|LeashKnot|Painting|ItemFrame|ArmorStand|EnderCrystal|ThrownEgg|Arrow|Snowball|Fireball|SmallFireball|ThrownEnderpearl|EyeOfEnderSignal|ThrownPotion|ThrownExpBottle|WitherSkull|FireworksRocketEntity|PrimedTnt|FallingSand|MinecartCommandBlock|Boat|MinecartRideable|MinecartChest|MinecartFurnace|MinecartTNT|MinecartHopper|MinecartSpawner|Mob|Monster|Creeper|Skeleton|Spider|Giant|Zombie|Slime|Ghast|PigZombie|Enderman|CaveSpider|Silverfish|Blaze|LavaSlime|EnderDragon|WitherBoss|Witch|Endermite|Guardian|Shulker|Rabbit|Bat|Pig|Sheep|Cow|Chicken|Squid|Wolf|MushroomCow|SnowMan|Ozelot|VillagerGolem|EntityHorse|Rabbit|Villager)\b/,
        token: "property" },
      { regex: /\/?(?:achievement|ban|ban-ip|banlist|blockdata|clear|clone|debug|defaultgamemode|deop|difficulty|effect|enchant|entitydata|execute|fill|gamemode|gamerule|give|help|kick|kill|list|me|op|pardon|particle|playsound|publish|replaceitem|save-all|save-off|save-on|say|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spreadplayers|stats|stop|summon|tell|tellraw|testfor|testforblock|testforblocks|time|title|toggledownfall|tp|trigger|weather|whitelist|worldborder|xp)\b/i,
        token: "keyword" },

      // Numbers
      { regex: /(?:~?-?(?:\.\d+|\d+\.?\d*)[bfs]?|~)/, token: "number" },

      // Ponctuation
      { regex: /[\[\]{}\(\)]/, token: "bracket" },
      { regex: /[\+-/*=%;:]/, token: "operator" },
      // { regex: /:$/, token: "operator", indent: true },

      // Pass
      { regex: /(?:\w+)/ }
    ],
    meta: {
      dontIndentStates: [ "comment" ],
      lineComment: "//"
    }
  } );

} );