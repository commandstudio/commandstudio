define( [ "codemirror", "codemirror/addon/mode/simple" ], function( CodeMirror ) {

  CodeMirror.defineSimpleMode( "commander", {
    start: [
      // Commander specific
      { regex: /([01irc\?!]+)(:)/, token: [ "quote", "operator" ] },
      // Doesn't work properly: last character is not styled
      // {regex: /(default)\s+([01irc\?!]+)/, token: ["header", "quote"]},
      { regex: /(?:include|default|def|position)/, token: "header" },
      { regex: /(?:\$\w+)/, token: "variable" },
      { regex: /(?:\^\w+)/, token: "variable-2" },
      { regex: /\/\/.*/, token: "comment" },
      { regex: /(?:\{#|#\})/, token: "variable-2" },

      // Minecraft Specific
      // {regex: /(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)(?:$|\b|\s)/, token: "number"},
      { regex: /@[aepr]\b/, token: "string" },
      { regex: /(?:item|xp_orb|area_effect_cloud|leash_knot|painting|item_frame|armor_stand|ender_crystal|egg|arrow|snowball|fireball|small_fireball|ender_pearl|eye_of_ender_signal|potion|xp_bottle|wither_skull|fireworks_rocket|spectral_arrow|shulker_bullet|dragon_fireball|tnt|falling_block|commandblock_minecart|boat|minecart|chest_minecart|furnace_minecart|tnt_minecart|hopper_minecart|spawner_minecart|creeper|skeleton|wither_skeleton|stray|spider|giant|zombie|zombie_villager|husk|slime|ghast|zombie_pigman|enderman|cave_spider|silverfish|blaze|magma_cube|ender_dragon|wither|witch|endermite|guardian|elder_guardian|shulker|mobs|bat|pig|sheep|cow|chicken|squid|wolf|mooshroom|snowman|ocelot|villager_golem|horse|donkey|mule|zombie_horse|skeleton_horse|rabbit|polar_bear|lightning_bolt)\b/,
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