define( [ "codemirror", "codemirror/addon/mode/simple" ], function( CodeMirror ) {

  CodeMirror.defineSimpleMode( "commander", {
    start: [
      // Commander specific
      { regex: /([01irc\?!]+)(:)/, token: [ "quote", "operator" ] },
      // Doesn't work properly: last character is not styled
      // {regex: /(default)\s+([01irc\?!]+)/, token: ["header", "quote"]},
      { regex: /(?:include|default|def|position)\b/, token: "header" },
      { regex: /\$\w+/, token: "variable" },
      { regex: /\^\w+/, token: "variable-2" },
      { regex: /\/\/.*/, token: "comment" },
      { regex: /(?:\{#|#\})/, token: "variable-2" },

      // Minecraft Specific
      // {regex: /(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)(?:$|\b|\s)/, token: "number"},
      { regex: /@[aepr]\b/, token: "string" },
      { regex: /(?:Item|XPOrb|LeashKnot|Painting|ItemFrame|ArmorStand|EnderCrystal|ThrownEgg|Arrow|Snowball|Fireball|SmallFireball|ThrownEnderpearl|EyeOfEnderSignal|ThrownPotion|ThrownExpBottle|WitherSkull|FireworksRocketEntity|PrimedTnt|FallingSand|MinecartCommandBlock|Boat|MinecartRideable|MinecartChest|MinecartFurnace|MinecartTNT|MinecartHopper|MinecartSpawner|Mob|Monster|Creeper|Skeleton|Spider|Giant|Zombie|Slime|Ghast|PigZombie|Enderman|CaveSpider|Silverfish|Blaze|LavaSlime|EnderDragon|WitherBoss|Witch|Endermite|Guardian|Shulker|Rabbit|Bat|Pig|Sheep|Cow|Chicken|Squid|Wolf|MushroomCow|SnowMan|Ozelot|VillagerGolem|EntityHorse|Rabbit|Villager)\b/,
        token: "property" },
      { regex: /\/?(?:achievement|ban|ban-ip|banlist|blockdata|clear|clone|debug|defaultgamemode|deop|difficulty|effect|enchant|entitydata|execute|fill|gamemode|gamerule|give|help|kick|kill|list|me|op|pardon|particle|playsound|publish|replaceitem|save-all|save-off|save-on|say|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spreadplayers|stats|stop|summon|tell|tellraw|testfor|testforblock|testforblocks|time|title|toggledownfall|tp|trigger|weather|whitelist|worldborder|xp)\b/i,
        token: "keyword" },

      // Ponctuation
      { regex: /[=\[\]{},]/, token: "hr" },

      // Numbers
      { regex: /-?~?(?:\.\d+|\d+\.?\d*)[bf]?/, token: "number" },
      { regex: /~/, token: "number" },

      // Pass
      { regex: /(?:\w+)/ }
    ],
    meta: {
      dontIndentStates: [ "comment" ],
      lineComment: "//"
    }
  } );

} );