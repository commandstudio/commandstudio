define( [
  "codemirror",
  "codemirror/addon/hint/show-hint"
], function( CodeMirror ) {
  var Pos = CodeMirror.Pos;

  var dictionnary = {
    "command": [
      [ "achievement", "*give|take", "#achievement", "#player" ],
      [ "advancement", "*grant|revoke|test", "#player", "*everything|from|only|through|until", "#advancement" ],
      [ "ban", "name", "reason" ],
      [ "ban-ip", "*address|name", "reason" ],
      [ "banlist", "*ips|players" ],
      [ "blockdata", "x", "y", "z", "dataTag" ],
      [ "clear", "#player", "#item", "dataValue", "maxCount", "dataTag" ],
      [ "clone", "x1", "y1", "z1", "x2", "y2", "z2", "x", "y", "z", "*filtered|masked|replace", "*force|move|normal", "#block" ],
      [ "debug", "*start|stop" ],
      [ "defaultgamemode", "#gamemode" ],
      [ "deop", "#player" ],
      [ "difficulty", "*peaceful|easy|normal|hard" ],
      [
        "effect", "#player", [
          [ "clear" ],
          [ "#effect", "seconds", "amplifier", "hideParticles" ]
        ]
      ],
      [ "enchant", "#player", "#enchantment", "enchantmentLevel" ],
      [ "entitydata", "@e", "dataTag" ],
      [
        "execute", "#selector", "~", "~", "~", [
          [ "detect", "~", "~", "~", "#block", "dataValue", "#/command" ],
          [ "#/command" ],
        ]
      ],
      [
        "fill", "x1", "y1", "z1", "x2", "y2", "z2", "#block", "dataValue", [
          [ "*destroy|hollow|keep|outline", "dataValue" ],
          [ "replace", "#block", "dataValue" ]
        ]
      ],
      [ "function", "name" ],
      [ "gamemode", "#gamemode", "#player" ],
      [ "gamerule", "*announceAdvancements|commandBlockOutput|disableElytraMovementCheck|doDaylightCycle|doEntityDrops|doFireTick|doLimitedCrafting|doMobLoot|doMobSpawning|doTileDrops|doWeatherCycle|gameLoopFunction|keepInventory|logAdminCommands|maxCommandChainLength|maxEntityCramming|mobGriefing|naturalRegeneration|randomTickSpeed|reducedDebugInfo|sendCommandFeedback|showDeathMessages|spawnRadius|spectatorsGenerateChunks", "value" ],
      [ "give", "#player", "#item", "amout", "dataValue", "dataTag" ],
      [ "help", "*command|page" ],
      [ "kick", "#player", "reason" ],
      [ "kill", "#selector" ],
      [ "list", "uuids" ],
      [ "locate", "*EndCity|Fortress|Mansion|Mineshaft|Monument|Stronghold|Temple|Village" ],
      [ "me", "action" ],
      [ "op", "#player" ],
      [ "pardon", "name" ],
      [ "pardon-ip", "address" ],
      [ "particle", "#particle", "x", "y", "z", "xd", "yd", "zd", "speed", "count", "mode", "#player", "params" ],
      [ "playsound", "#sound", "#soundSource", "#selector", "x", "y", "z", "volume", "pitch", "minimumVolume" ],
      [ "publish" ],
      [ "recipe", "*give|take", "#player", "#recipe" ],
      [
        "replaceitem", [
          [ "block", "x", "y", "z", "#slot", "#item", "amount", "dataValue", "dataTag" ],
          [ "entity", "#selector", "#slot", "#item", "amount", "dataValue", "dataTag" ]
        ]
      ],
      [ "save" ],
      [ "save-all" ],
      [ "save-off" ],
      [ "save-on" ],
      [ "say", "message" ],
      [
        "scoreboard", [
          [
            "objectives", [
              [ "add", "objectiveName", "#criteria", "displayName" ],
              [ "list" ],
              [ "remove", "objectiveName" ],
              [ "setdisplay", "#displaySlot", "objectiveName" ]
            ]
          ],
          [
            "players", [
              [ "*add|remove|set", "#selector", "objectiveName", "value", "dataTag" ],
              [ "enable", "#player", "triggerName" ],
              [ "list", "#selector" ],
              [ "operation", "#selector", "objectiveName", "*+=|-=|*=|/=|%=|=|<|>|><", "#selector", "objectiveName" ],
              [
                "tag", "#player", [
                  [ "*add|remove", "tagName", "dataTag" ],
                  [ "list" ]
                ]
              ],
              [ "test", "#selector", "objectiveName", "min", "max" ]
            ]
          ],
          [
            "teams", [
              [ "add", "teamName", "displayName" ],
              [ "*empty|list|remove", "teamName" ],
              [ "join", "teamName", "#selector" ],
              [ "leave", "#selector" ],
              [
                "option", "teamName", [
                  [ "color", "#color" ],
                  [ "*friendlyfire|seeFriendlyInvisibles", "#boolean" ],
                  [ "*nametagVisibility|deathMessageVisibility", "*never|hideForOtherTeams|hideForOwnTeam|always" ],
                  [ "collisionRule", "*always|never|pushOwnTeam|pushOtherTeams" ]
                ]
              ]
            ]
          ]
        ]
      ],
      [ "seed" ],
      [ "setblock", "x", "y", "z", "#block", "dataValue", "*destroy|keep|replace", "dataTag" ],
      [ "setidletimeout", "minutes" ],
      [ "setworldspawn", "x", "y", "z" ],
      [ "spawnpoint", "#player", "x", "y", "z" ],
      [ "spreadplayers", "x", "z", "spreadDistance", "maxRange", "respectTeams", "#player" ],
      [
        "stats", [
          [
            "block", "x", "y", "z", [
              [ "clear", "#stat" ],
              [ "set", "#stat", "#selector", "objective" ]
            ]
          ],
          [
            "entity", "#selector", [
              [ "clear", "#stat" ],
              [ "set", "#stat", "#selector", "objective" ]
            ]
          ]
        ]
      ],
      [ "stop" ],
      [ "stopsound", "#player", "#soundSource", "#sound" ],
      [ "summon", "#entity", "~", "~", "~", "dataTag" ],
      [ "teleport", "#selector", "x", "y", "z", "y-rot", "x-rot" ],
      [ "tell", "#player", "message" ],
      [ "tellraw", "#player", "jsonText" ],
      [ "testfor", "#selector", "dataTag" ],
      [ "testforblock", "x", "y", "z", "#block", "dataValue", "dataTag" ],
      [ "testforblocks", "x1", "y1", "z1", "x2", "y2", "z2", "x", "y", "z", "*all|masked" ],
      [
        "time", [
          [ "add", "value" ],
          [ "query", "*day|daytime|gametime" ],
          [ "set", "*value|day|night" ]
        ]
      ],
      [
        "title", "#player", [
          [ "*clear|reset" ],
          [ "*title|subtitle|actionbar", "jsonText" ],
          [ "times", "fadeIn", "stay", "fadeOut" ]
        ]
      ],
      [ "toggledownfall" ],
      [
        "tp", "#selector", [
          [ "x", "y", "z", "y-rot", "x-rot" ],
          [ "#selector" ]
        ]
      ],
      [ "trigger", "objective", "*add|set", "value" ],
      [ "weather", "*clear|rain|thunder", "duration" ],
      [
        "whitelist", [
          [ "*add|remove", "#player" ],
          [ "*list|off|on|reload" ]
        ]
      ],
      [
        "worldborder",
        [
          [ "add", "distance", "time" ],
          [ "center", "x", "z" ],
          [ "damage", "*amount|buffer", "value" ],
          [ "get" ],
          [ "set", "distance", "time" ],
          [ "warning", "*distance|time", "value" ]
        ]
      ],
      [ "xp", "amount", "#player" ],

      [ "=>", "#stat", "playerName", "objective", "initValue" ]
    ],
    "/command": [
      [ "/achievement", "*give|take", "#achievement", "#player" ],
      [ "/advancement", "*grant|revoke|test", "#player", "*everything|from|only|through|until", "#advancement" ],
      [ "/ban", "name", "reason" ],
      [ "/ban-ip", "*address|name", "reason" ],
      [ "/banlist", "*ips|players" ],
      [ "/blockdata", "x", "y", "z", "dataTag" ],
      [ "/clear", "#player", "#item", "dataValue", "maxCount", "dataTag" ],
      [ "/clone", "x1", "y1", "z1", "x2", "y2", "z2", "x", "y", "z", "*filtered|masked|replace", "*force|move|normal", "#block" ],
      [ "/debug", "*start|stop" ],
      [ "/defaultgamemode", "#gamemode" ],
      [ "/deop", "#player" ],
      [ "/difficulty", "*peaceful|easy|normal|hard" ],
      [
        "/effect", "#player", [
          [ "clear" ],
          [ "#effect", "seconds", "amplifier", "hideParticles" ]
        ]
      ],
      [ "/enchant", "#player", "#enchantment", "enchantmentLevel" ],
      [ "/entitydata", "@e", "dataTag" ],
      [
        "/execute", "#selector", "~", "~", "~", [
          [ "detect", "~", "~", "~", "#block", "dataValue", "#/command" ],
          [ "#/command" ]
        ]
      ],
      [
        "/fill", "x1", "y1", "z1", "x2", "y2", "z2", "#block", "dataValue", [
          [ "*destroy|hollow|keep|outline", "dataValue" ],
          [ "replace", "#block", "dataValue" ]
        ]
      ],
      [ "/function", "name" ],
      [ "/gamemode", "#gamemode", "#player" ],
      [ "/gamerule", "*announceAdvancements|commandBlockOutput|disableElytraMovementCheck|doDaylightCycle|doEntityDrops|doFireTick|doLimitedCrafting|doMobLoot|doMobSpawning|doTileDrops|doWeatherCycle|gameLoopFunction|keepInventory|logAdminCommands|maxCommandChainLength|maxEntityCramming|mobGriefing|naturalRegeneration|randomTickSpeed|reducedDebugInfo|sendCommandFeedback|showDeathMessages|spawnRadius|spectatorsGenerateChunks", "value" ],
      [ "/give", "#player", "#item", "amout", "dataValue", "dataTag" ],
      [ "/help", "*command|page" ],
      [ "/kick", "#player", "reason" ],
      [ "/kill", "#selector" ],
      [ "/list", "uuids" ],
      [ "/me", "action" ],
      [ "/op", "#player" ],
      [ "/pardon", "name" ],
      [ "/pardon-ip", "address" ],
      [ "/particle", "#particle", "x", "y", "z", "xd", "yd", "zd", "speed", "count", "mode", "#player", "params" ],
      [ "/playsound", "#sound", "#soundSource", "#selector", "x", "y", "z", "volume", "pitch", "minimumVolume" ],
      [ "/publish" ],
      [ "/recipe", "*give|take", "#player", "#recipe" ],
      [
        "/replaceitem", [
          [ "block", "x", "y", "z", "#slot", "#item", "amount", "dataValue", "dataTag" ],
          [ "entity", "#selector", "#slot", "#item", "amount", "dataValue", "dataTag" ]
        ]
      ],
      [ "/save" ],
      [ "/save-all" ],
      [ "/save-off" ],
      [ "/save-on" ],
      [ "/say", "message" ],
      [
        "/scoreboard", [
          [
            "objectives", [
              [ "add", "objectiveName", "#criteria", "displayName" ],
              [ "list" ],
              [ "remove", "objectiveName" ],
              [ "setdisplay", "#displaySlot", "objectiveName" ]
            ]
          ],
          [
            "players", [
              [ "*add|remove|set", "#selector", "objectiveName", "value", "dataTag" ],
              [ "enable", "#player", "triggerName" ],
              [ "list", "#selector" ],
              [ "operation", "#selector", "objectiveName", "*+=|-=|*=|/=|%=|=|<|>|><", "#selector", "objectiveName" ],
              [
                "tag", "#player", [
                  [ "*add|remove", "tagName", "dataTag" ],
                  [ "list" ]
                ]
              ],
              [ "test", "#selector", "objectiveName", "min", "max" ]
            ]
          ],
          [
            "teams", [
              [ "add", "teamName", "displayName" ],
              [ "*empty|list|remove", "teamName" ],
              [ "join", "teamName", "#selector" ],
              [ "leave", "#selector" ],
              [
                "option", "teamName", [
                  [ "color", "#color" ],
                  [ "*friendlyfire|seeFriendlyInvisibles", "#boolean" ],
                  [ "*nametagVisibility|deathMessageVisibility", "*never|hideForOtherTeams|hideForOwnTeam|always" ],
                  [ "collisionRule", "*always|never|pushOwnTeam|pushOtherTeams" ]
                ]
              ]
            ]
          ]
        ]
      ],
      [ "/seed" ],
      [ "/setblock", "x", "y", "z", "#block", "dataValue", "*destroy|keep|replace", "dataTag" ],
      [ "/setidletimeout", "minutes" ],
      [ "/setworldspawn", "x", "y", "z" ],
      [ "/spawnpoint", "#player", "x", "y", "z" ],
      [ "/spreadplayers", "x", "z", "spreadDistance", "maxRange", "respectTeams", "#player" ],
      [
        "/stats", [
          [
            "block", "x", "y", "z", [
              [ "clear", "#stat" ],
              [ "set", "#stat", "#selector", "objective" ]
            ]
          ],
          [
            "entity", "#selector", [
              [ "clear", "#stat" ],
              [ "set", "#stat", "#selector", "objective" ]
            ]
          ]
        ]
      ],
      [ "/stop" ],
      [ "/stopsound", "#player", "#soundSource", "#sound" ],
      [ "/summon", "#entity", "~", "~", "~", "dataTag" ],
      [ "/teleport", "#selector", "x", "y", "z", "y-rot", "x-rot" ],
      [ "/tell", "#player", "message" ],
      [ "/tellraw", "#player", "jsonText" ],
      [ "/testfor", "#selector", "dataTag" ],
      [ "/testforblock", "x", "y", "z", "#block", "dataValue", "dataTag" ],
      [ "/testforblocks", "x1", "y1", "z1", "x2", "y2", "z2", "x", "y", "z", "*all|masked" ],
      [
        "/time", [
          [ "add", "value" ],
          [ "query", "*day|daytime|gametime" ],
          [ "set", "*value|day|night" ]
        ]
      ],
      [
        "/title", "#player", [
          [ "*clear|reset" ],
          [ "*title|subtitle|actionbar", "jsonText" ],
          [ "times", "fadeIn", "stay", "fadeOut" ]
        ]
      ],
      [ "/toggledownfall" ],
      [
        "/tp", "#selector", [
          [ "x", "y", "z", "y-rot", "x-rot" ],
          [ "#selector" ]
        ]
      ],
      [ "/trigger", "objective", "*add|set", "value" ],
      [ "/weather", "*clear|rain|thunder", "duration" ],
      [
        "/whitelist", [
          [ "*add|remove", "#player" ],
          [ "*list|off|on|reload" ]
        ]
      ],
      [
        "/worldborder",
        [
          [ "add", "distance", "time" ],
          [ "center", "x", "z" ],
          [ "damage", "*amount|buffer", "value" ],
          [ "get" ],
          [ "set", "distance", "time" ],
          [ "warning", "*distance|time", "value" ]
        ]
      ],
      [ "/xp", "amount", "#player" ],

      [ "=>", "#stat", "playerName", "objective", "initValue" ]
    ],
    "achievement": "*acquireIron|bakeCake|blazeRod|bookcase|breedCow|buildBetterPickaxe|buildFurnace|buildHoe|buildPickaxe|buildSword|buildWorkBench|cookFish|diamonds|diamondsToYou|enchantments|exploreAllBiomes|flyPig|fullBeacon|ghast|killCow|killEnemy|killWither|makeBread|mineWood|onARail|openInventory|overkill|overpowered|portal|potion|snipeSkeleton|spawnWither|theEnd|theEnd2",
    "block": "*acacia_door|acacia_fence|acacia_fence_gate|acacia_stairs|activator_rail|air|anvil|barrier|beacon|bed|bedrock|beetroots|birch_door|birch_fence|birch_fence_gate|birch_stairs|black_shulker_box|blue_shulker_box|bone_block|bookshelf|brewing_stand|brick_block|brick_stairs|brown_mushroom|brown_mushroom_block|brown_shulker_box|cactus|cake|carpet|carrots|cauldron|chain_command_block|chest|chorus_flower|chorus_plant|clay|coal_block|coal_ore|cobblestone|cobblestone_wall|cocoa|command_block|crafting_table|cyan_shulker_box|dark_oak_door|dark_oak_fence|dark_oak_fence_gate|dark_oak_stairs|daylight_detector|daylight_detector_inverted|deadbush|detector_rail|diamond_block|diamond_ore|dirt|dispenser|double_plant|double_stone_slab|double_stone_slab2|double_wooden_slab|dragon_egg|dropper|emerald_block|emerald_ore|enchanting_table|end_bricks|end_gateway|end_portal|end_portal_frame|end_rod|end_stone|ender_chest|farmland|fence|fence_gate|fire|flower_pot|flowing_lava|flowing_water|frosted_ice|furnace|glass|glass_pane|glowstone|gold_block|gold_ore|golden_rail|grass|grass_path|gravel|gray_shulker_box|green_shulker_box|hardened_clay|hay_block|heavy_weighted_pressure_plate|hopper|ice|iron_bars|iron_block|iron_door|iron_ore|iron_trapdoor|jukebox|jungle_door|jungle_fence|jungle_fence_gate|jungle_stairs|ladder|lapis_block|lapis_ore|lava|leaves|leaves2|lever|light_blue_shulker_box|light_weighted_pressure_plate|lime_shulker_box|lit_furnace|lit_pumpkin|lit_redstone_lamp|lit_redstone_ore|log|log2|magenta_shulker_box|magma|melon_block|melon_stem|mob_spawner|monster_egg|mossy_cobblestone|mycelium|nether_brick|nether_brick_fence|nether_brick_stairs|nether_wart|nether_wart_block|netherrack|noteblock|oak_stairs|observer|obsidian|orange_shulker_box|packed_ice|pink_shulker_box|piston|piston_extension|piston_head|planks|portal|potatoes|powered_comparator|powered_repeater|prismarine|pumpkin|pumpkin_stem|purple_shulker_box|purpur_block|purpur_double_slab|purpur_pillar|purpur_slab|purpur_stairs|quartz_block|quartz_ore|quartz_stairs|rail|red_flower|red_mushroom|red_mushroom_block|red_nether_brick|red_sandstone|red_sandstone_stairs|red_shulker_box|redstone_block|redstone_lamp|redstone_ore|redstone_torch|redstone_wire|reeds|repeating_command_block|sand|sandstone|sandstone_stairs|sapling|sea_lantern|silver_shulker_box|skull|slime|snow|snow_layer|soul_sand|sponge|spruce_door|spruce_fence|spruce_fence_gate|spruce_stairs|stained_glass|stained_glass_pane|stained_hardened_clay|standing_banner|standing_sign|sticky_piston|stone|stone_brick_stairs|stone_button|stone_pressure_plate|stone_slab|stone_slab2|stone_stairs|stonebrick|structure_block|structure_void|tallgrass|tnt|torch|trapdoor|trapped_chest|tripwire|tripwire_hook|unlit_redstone_torch|unpowered_comparator|unpowered_repeater|vine|wall_banner|wall_sign|water|waterlily|web|wheat|white_shulker_box|wooden_button|wooden_door|wooden_pressure_plate|wooden_slab|wool|yellow_flower|yellow_shulker_box",
    "boolean": "*true|false",
    "color": "*reset|black|dark_blue|dark_green|dark_aqua|dark_red|dark_purple|gold|gray|dark_gray|blue|green|aqua|red|light_purple|yellow|white",
    "criteria": "*air|armor|deathCount|dummy|food|health|level|playerKillCount|totalKillCount|trigger|xp|achievement.acquireIron|achievement.bakeCake|achievement.blazeRod|achievement.bookcase|achievement.breedCow|achievement.buildBetterPickaxe|achievement.buildFurnace|achievement.buildHoe|achievement.buildPickaxe|achievement.buildSword|achievement.buildWorkBench|achievement.cookFish|achievement.diamonds|achievement.diamondsToYou|achievement.enchantments|achievement.exploreAllBiomes|achievement.flyPig|achievement.fullBeacon|achievement.ghast|achievement.killCow|achievement.killEnemy|achievement.killWither|achievement.makeBread|achievement.mineWood|achievement.onARail|achievement.openInventory|achievement.overkill|achievement.overpowered|achievement.portal|achievement.potion|achievement.snipeSkeleton|achievement.spawnWither|achievement.theEnd|achievement.theEnd2|killedByTeam.aqua|killedByTeam.black|killedByTeam.blue|killedByTeam.dark_aqua|killedByTeam.dark_blue|killedByTeam.dark_gray|killedByTeam.dark_green|killedByTeam.dark_purple|killedByTeam.dark_red|killedByTeam.gold|killedByTeam.gray|killedByTeam.green|killedByTeam.light_purple|killedByTeam.red|killedByTeam.white|killedByTeam.yellow|teamkill.aqua|teamkill.black|teamkill.blue|teamkill.dark_aqua|teamkill.dark_blue|teamkill.dark_gray|teamkill.dark_green|teamkill.dark_purple|teamkill.dark_red|teamkill.gold|teamkill.gray|teamkill.green|teamkill.light_purple|teamkill.red|teamkill.white|teamkill.yellow|stat.animalsBred|stat.armorCleaned|stat.aviateOneCm|stat.bannerCleaned|stat.beaconInteraction|stat.boatOneCm|stat.breakItem.minecraft.bow|stat.breakItem.minecraft.carrot_on_a_stick|stat.breakItem.minecraft.chainmail_boots|stat.breakItem.minecraft.chainmail_chestplate|stat.breakItem.minecraft.chainmail_helmet|stat.breakItem.minecraft.chainmail_leggings|stat.breakItem.minecraft.diamond_axe|stat.breakItem.minecraft.diamond_boots|stat.breakItem.minecraft.diamond_chestplate|stat.breakItem.minecraft.diamond_helmet|stat.breakItem.minecraft.diamond_hoe|stat.breakItem.minecraft.diamond_leggings|stat.breakItem.minecraft.diamond_pickaxe|stat.breakItem.minecraft.diamond_shovel|stat.breakItem.minecraft.diamond_sword|stat.breakItem.minecraft.elytra|stat.breakItem.minecraft.fishing_rod|stat.breakItem.minecraft.flint_and_steel|stat.breakItem.minecraft.golden_axe|stat.breakItem.minecraft.golden_boots|stat.breakItem.minecraft.golden_chestplate|stat.breakItem.minecraft.golden_helmet|stat.breakItem.minecraft.golden_hoe|stat.breakItem.minecraft.golden_leggings|stat.breakItem.minecraft.golden_pickaxe|stat.breakItem.minecraft.golden_shovel|stat.breakItem.minecraft.golden_sword|stat.breakItem.minecraft.iron_axe|stat.breakItem.minecraft.iron_boots|stat.breakItem.minecraft.iron_chestplate|stat.breakItem.minecraft.iron_helmet|stat.breakItem.minecraft.iron_hoe|stat.breakItem.minecraft.iron_leggings|stat.breakItem.minecraft.iron_pickaxe|stat.breakItem.minecraft.iron_shovel|stat.breakItem.minecraft.iron_sword|stat.breakItem.minecraft.leather_boots|stat.breakItem.minecraft.leather_chestplate|stat.breakItem.minecraft.leather_helmet|stat.breakItem.minecraft.leather_leggings|stat.breakItem.minecraft.shears|stat.breakItem.minecraft.shield|stat.breakItem.minecraft.stone_axe|stat.breakItem.minecraft.stone_hoe|stat.breakItem.minecraft.stone_pickaxe|stat.breakItem.minecraft.stone_shovel|stat.breakItem.minecraft.stone_sword|stat.breakItem.minecraft.wooden_axe|stat.breakItem.minecraft.wooden_hoe|stat.breakItem.minecraft.wooden_pickaxe|stat.breakItem.minecraft.wooden_shovel|stat.breakItem.minecraft.wooden_sword|stat.brewingstandInteraction|stat.cakeSlicesEaten|stat.cauldronFilled|stat.cauldronUsed|stat.chestOpened|stat.climbOneCm|stat.craftItem.minecraft.acacia_boat|stat.craftItem.minecraft.acacia_door|stat.craftItem.minecraft.acacia_fence|stat.craftItem.minecraft.acacia_fence_gate|stat.craftItem.minecraft.acacia_stairs|stat.craftItem.minecraft.activator_rail|stat.craftItem.minecraft.anvil|stat.craftItem.minecraft.armor_stand|stat.craftItem.minecraft.arrow|stat.craftItem.minecraft.baked_potato|stat.craftItem.minecraft.banner|stat.craftItem.minecraft.beacon|stat.craftItem.minecraft.bed|stat.craftItem.minecraft.beetroot_soup|stat.craftItem.minecraft.birch_boat|stat.craftItem.minecraft.birch_door|stat.craftItem.minecraft.birch_fence|stat.craftItem.minecraft.birch_fence_gate|stat.craftItem.minecraft.birch_stairs|stat.craftItem.minecraft.blaze_powder|stat.craftItem.minecraft.boat|stat.craftItem.minecraft.bone_block|stat.craftItem.minecraft.book|stat.craftItem.minecraft.bookshelf|stat.craftItem.minecraft.bow|stat.craftItem.minecraft.bowl|stat.craftItem.minecraft.bread|stat.craftItem.minecraft.brewing_stand|stat.craftItem.minecraft.brick|stat.craftItem.minecraft.brick_block|stat.craftItem.minecraft.brick_stairs|stat.craftItem.minecraft.bucket|stat.craftItem.minecraft.cake|stat.craftItem.minecraft.carpet|stat.craftItem.minecraft.carrot_on_a_stick|stat.craftItem.minecraft.cauldron|stat.craftItem.minecraft.chest|stat.craftItem.minecraft.chest_minecart|stat.craftItem.minecraft.chorus_fruit_popped|stat.craftItem.minecraft.clay|stat.craftItem.minecraft.clock|stat.craftItem.minecraft.coal|stat.craftItem.minecraft.coal_block|stat.craftItem.minecraft.cobblestone_wall|stat.craftItem.minecraft.comparator|stat.craftItem.minecraft.compass|stat.craftItem.minecraft.cooked_beef|stat.craftItem.minecraft.cooked_chicken|stat.craftItem.minecraft.cooked_fish|stat.craftItem.minecraft.cooked_mutton|stat.craftItem.minecraft.cooked_porkchop|stat.craftItem.minecraft.cooked_rabbit|stat.craftItem.minecraft.cookie|stat.craftItem.minecraft.crafting_table|stat.craftItem.minecraft.dark_oak_boat|stat.craftItem.minecraft.dark_oak_door|stat.craftItem.minecraft.dark_oak_fence|stat.craftItem.minecraft.dark_oak_fence_gate|stat.craftItem.minecraft.dark_oak_stairs|stat.craftItem.minecraft.daylight_detector|stat.craftItem.minecraft.detector_rail|stat.craftItem.minecraft.diamond|stat.craftItem.minecraft.diamond_axe|stat.craftItem.minecraft.diamond_block|stat.craftItem.minecraft.diamond_boots|stat.craftItem.minecraft.diamond_chestplate|stat.craftItem.minecraft.diamond_helmet|stat.craftItem.minecraft.diamond_hoe|stat.craftItem.minecraft.diamond_leggings|stat.craftItem.minecraft.diamond_pickaxe|stat.craftItem.minecraft.diamond_shovel|stat.craftItem.minecraft.diamond_sword|stat.craftItem.minecraft.dirt|stat.craftItem.minecraft.dispenser|stat.craftItem.minecraft.dropper|stat.craftItem.minecraft.dye|stat.craftItem.minecraft.emerald|stat.craftItem.minecraft.emerald_block|stat.craftItem.minecraft.enchanting_table|stat.craftItem.minecraft.end_bricks|stat.craftItem.minecraft.end_crystal|stat.craftItem.minecraft.end_rod|stat.craftItem.minecraft.ender_chest|stat.craftItem.minecraft.ender_eye|stat.craftItem.minecraft.fence|stat.craftItem.minecraft.fence_gate|stat.craftItem.minecraft.fermented_spider_eye|stat.craftItem.minecraft.fire_charge|stat.craftItem.minecraft.fishing_rod|stat.craftItem.minecraft.flint_and_steel|stat.craftItem.minecraft.flower_pot|stat.craftItem.minecraft.furnace|stat.craftItem.minecraft.furnace_minecart|stat.craftItem.minecraft.glass|stat.craftItem.minecraft.glass_bottle|stat.craftItem.minecraft.glass_pane|stat.craftItem.minecraft.glowstone|stat.craftItem.minecraft.gold_block|stat.craftItem.minecraft.gold_ingot|stat.craftItem.minecraft.gold_nugget|stat.craftItem.minecraft.golden_apple|stat.craftItem.minecraft.golden_axe|stat.craftItem.minecraft.golden_boots|stat.craftItem.minecraft.golden_carrot|stat.craftItem.minecraft.golden_chestplate|stat.craftItem.minecraft.golden_helmet|stat.craftItem.minecraft.golden_hoe|stat.craftItem.minecraft.golden_leggings|stat.craftItem.minecraft.golden_pickaxe|stat.craftItem.minecraft.golden_rail|stat.craftItem.minecraft.golden_shovel|stat.craftItem.minecraft.golden_sword|stat.craftItem.minecraft.hardened_clay|stat.craftItem.minecraft.hay_block|stat.craftItem.minecraft.heavy_weighted_pressure_plate|stat.craftItem.minecraft.hopper|stat.craftItem.minecraft.hopper_minecart|stat.craftItem.minecraft.iron_axe|stat.craftItem.minecraft.iron_bars|stat.craftItem.minecraft.iron_block|stat.craftItem.minecraft.iron_boots|stat.craftItem.minecraft.iron_chestplate|stat.craftItem.minecraft.iron_door|stat.craftItem.minecraft.iron_helmet|stat.craftItem.minecraft.iron_hoe|stat.craftItem.minecraft.iron_ingot|stat.craftItem.minecraft.iron_leggings|stat.craftItem.minecraft.iron_pickaxe|stat.craftItem.minecraft.iron_shovel|stat.craftItem.minecraft.iron_sword|stat.craftItem.minecraft.iron_trapdoor|stat.craftItem.minecraft.item_frame|stat.craftItem.minecraft.jukebox|stat.craftItem.minecraft.jungle_boat|stat.craftItem.minecraft.jungle_door|stat.craftItem.minecraft.jungle_fence|stat.craftItem.minecraft.jungle_fence_gate|stat.craftItem.minecraft.jungle_stairs|stat.craftItem.minecraft.ladder|stat.craftItem.minecraft.lapis_block|stat.craftItem.minecraft.lead|stat.craftItem.minecraft.leather|stat.craftItem.minecraft.leather_boots|stat.craftItem.minecraft.leather_chestplate|stat.craftItem.minecraft.leather_helmet|stat.craftItem.minecraft.leather_leggings|stat.craftItem.minecraft.lever|stat.craftItem.minecraft.light_weighted_pressure_plate|stat.craftItem.minecraft.lit_pumpkin|stat.craftItem.minecraft.magma|stat.craftItem.minecraft.magma_cream|stat.craftItem.minecraft.map|stat.craftItem.minecraft.melon_block|stat.craftItem.minecraft.melon_seeds|stat.craftItem.minecraft.minecart|stat.craftItem.minecraft.mossy_cobblestone|stat.craftItem.minecraft.mushroom_stew|stat.craftItem.minecraft.nether_brick|stat.craftItem.minecraft.nether_brick_fence|stat.craftItem.minecraft.nether_brick_stairs|stat.craftItem.minecraft.nether_wart_block|stat.craftItem.minecraft.netherbrick|stat.craftItem.minecraft.noteblock|stat.craftItem.minecraft.oak_stairs|stat.craftItem.minecraft.painting|stat.craftItem.minecraft.paper|stat.craftItem.minecraft.piston|stat.craftItem.minecraft.planks|stat.craftItem.minecraft.prismarine|stat.craftItem.minecraft.pumpkin_pie|stat.craftItem.minecraft.pumpkin_seeds|stat.craftItem.minecraft.purpur_block|stat.craftItem.minecraft.purpur_pillar|stat.craftItem.minecraft.purpur_slab|stat.craftItem.minecraft.purpur_stairs|stat.craftItem.minecraft.quartz|stat.craftItem.minecraft.quartz_block|stat.craftItem.minecraft.quartz_stairs|stat.craftItem.minecraft.rabbit_stew|stat.craftItem.minecraft.rail|stat.craftItem.minecraft.red_nether_brick|stat.craftItem.minecraft.red_sandstone|stat.craftItem.minecraft.red_sandstone_stairs|stat.craftItem.minecraft.redstone|stat.craftItem.minecraft.redstone_block|stat.craftItem.minecraft.redstone_lamp|stat.craftItem.minecraft.redstone_torch|stat.craftItem.minecraft.repeater|stat.craftItem.minecraft.sandstone|stat.craftItem.minecraft.sandstone_stairs|stat.craftItem.minecraft.sea_lantern|stat.craftItem.minecraft.shears|stat.craftItem.minecraft.shield|stat.craftItem.minecraft.sign|stat.craftItem.minecraft.slime|stat.craftItem.minecraft.slime_ball|stat.craftItem.minecraft.snow|stat.craftItem.minecraft.snow_layer|stat.craftItem.minecraft.speckled_melon|stat.craftItem.minecraft.spectral_arrow|stat.craftItem.minecraft.sponge|stat.craftItem.minecraft.spruce_boat|stat.craftItem.minecraft.spruce_door|stat.craftItem.minecraft.spruce_fence|stat.craftItem.minecraft.spruce_fence_gate|stat.craftItem.minecraft.spruce_stairs|stat.craftItem.minecraft.stained_glass|stat.craftItem.minecraft.stained_glass_pane|stat.craftItem.minecraft.stained_hardened_clay|stat.craftItem.minecraft.stick|stat.craftItem.minecraft.sticky_piston|stat.craftItem.minecraft.stone|stat.craftItem.minecraft.stone_axe|stat.craftItem.minecraft.stone_brick_stairs|stat.craftItem.minecraft.stone_button|stat.craftItem.minecraft.stone_hoe|stat.craftItem.minecraft.stone_pickaxe|stat.craftItem.minecraft.stone_pressure_plate|stat.craftItem.minecraft.stone_shovel|stat.craftItem.minecraft.stone_slab|stat.craftItem.minecraft.stone_slab2|stat.craftItem.minecraft.stone_stairs|stat.craftItem.minecraft.stone_sword|stat.craftItem.minecraft.stonebrick|stat.craftItem.minecraft.sugar|stat.craftItem.minecraft.tnt|stat.craftItem.minecraft.tnt_minecart|stat.craftItem.minecraft.torch|stat.craftItem.minecraft.trapdoor|stat.craftItem.minecraft.trapped_chest|stat.craftItem.minecraft.tripwire_hook|stat.craftItem.minecraft.wheat|stat.craftItem.minecraft.wooden_axe|stat.craftItem.minecraft.wooden_button|stat.craftItem.minecraft.wooden_door|stat.craftItem.minecraft.wooden_hoe|stat.craftItem.minecraft.wooden_pickaxe|stat.craftItem.minecraft.wooden_pressure_plate|stat.craftItem.minecraft.wooden_shovel|stat.craftItem.minecraft.wooden_slab|stat.craftItem.minecraft.wooden_sword|stat.craftItem.minecraft.wool|stat.craftItem.minecraft.writable_book|stat.craftingTableInteraction|stat.crouchOneCm|stat.damageDealt|stat.damageTaken|stat.deaths|stat.dispenserInspected|stat.diveOneCm|stat.drop|stat.drop.minecraft.acacia_boat|stat.drop.minecraft.acacia_door|stat.drop.minecraft.acacia_fence|stat.drop.minecraft.acacia_fence_gate|stat.drop.minecraft.acacia_stairs|stat.drop.minecraft.activator_rail|stat.drop.minecraft.anvil|stat.drop.minecraft.apple|stat.drop.minecraft.armor_stand|stat.drop.minecraft.arrow|stat.drop.minecraft.baked_potato|stat.drop.minecraft.banner|stat.drop.minecraft.barrier|stat.drop.minecraft.beacon|stat.drop.minecraft.bed|stat.drop.minecraft.bedrock|stat.drop.minecraft.beef|stat.drop.minecraft.beetroot|stat.drop.minecraft.beetroot_seeds|stat.drop.minecraft.beetroot_soup|stat.drop.minecraft.birch_boat|stat.drop.minecraft.birch_door|stat.drop.minecraft.birch_fence|stat.drop.minecraft.birch_fence_gate|stat.drop.minecraft.birch_stairs|stat.drop.minecraft.blaze_powder|stat.drop.minecraft.blaze_rod|stat.drop.minecraft.boat|stat.drop.minecraft.bone|stat.drop.minecraft.bone_block|stat.drop.minecraft.book|stat.drop.minecraft.bookshelf|stat.drop.minecraft.bow|stat.drop.minecraft.bowl|stat.drop.minecraft.bread|stat.drop.minecraft.brewing_stand|stat.drop.minecraft.brick|stat.drop.minecraft.brick_block|stat.drop.minecraft.brick_stairs|stat.drop.minecraft.brown_mushroom|stat.drop.minecraft.brown_mushroom_block|stat.drop.minecraft.bucket|stat.drop.minecraft.cactus|stat.drop.minecraft.cake|stat.drop.minecraft.carpet|stat.drop.minecraft.carrot|stat.drop.minecraft.carrot_on_a_stick|stat.drop.minecraft.cauldron|stat.drop.minecraft.chain_command_block|stat.drop.minecraft.chainmail_boots|stat.drop.minecraft.chainmail_chestplate|stat.drop.minecraft.chainmail_helmet|stat.drop.minecraft.chainmail_leggings|stat.drop.minecraft.chest|stat.drop.minecraft.chest_minecart|stat.drop.minecraft.chicken|stat.drop.minecraft.chorus_flower|stat.drop.minecraft.chorus_fruit|stat.drop.minecraft.chorus_fruit_popped|stat.drop.minecraft.chorus_plant|stat.drop.minecraft.clay|stat.drop.minecraft.clay_ball|stat.drop.minecraft.clock|stat.drop.minecraft.coal|stat.drop.minecraft.coal_block|stat.drop.minecraft.coal_ore|stat.drop.minecraft.cobblestone|stat.drop.minecraft.cobblestone_wall|stat.drop.minecraft.command_block|stat.drop.minecraft.command_block_minecart|stat.drop.minecraft.comparator|stat.drop.minecraft.compass|stat.drop.minecraft.cooked_beef|stat.drop.minecraft.cooked_chicken|stat.drop.minecraft.cooked_fish|stat.drop.minecraft.cooked_mutton|stat.drop.minecraft.cooked_porkchop|stat.drop.minecraft.cooked_rabbit|stat.drop.minecraft.cookie|stat.drop.minecraft.crafting_table|stat.drop.minecraft.dark_oak_boat|stat.drop.minecraft.dark_oak_door|stat.drop.minecraft.dark_oak_fence|stat.drop.minecraft.dark_oak_fence_gate|stat.drop.minecraft.dark_oak_stairs|stat.drop.minecraft.daylight_detector|stat.drop.minecraft.deadbush|stat.drop.minecraft.detector_rail|stat.drop.minecraft.diamond|stat.drop.minecraft.diamond_axe|stat.drop.minecraft.diamond_block|stat.drop.minecraft.diamond_boots|stat.drop.minecraft.diamond_chestplate|stat.drop.minecraft.diamond_helmet|stat.drop.minecraft.diamond_hoe|stat.drop.minecraft.diamond_horse_armor|stat.drop.minecraft.diamond_leggings|stat.drop.minecraft.diamond_ore|stat.drop.minecraft.diamond_pickaxe|stat.drop.minecraft.diamond_shovel|stat.drop.minecraft.diamond_sword|stat.drop.minecraft.dirt|stat.drop.minecraft.dispenser|stat.drop.minecraft.double_plant|stat.drop.minecraft.dragon_breath|stat.drop.minecraft.dragon_egg|stat.drop.minecraft.dropper|stat.drop.minecraft.dye|stat.drop.minecraft.egg|stat.drop.minecraft.elytra|stat.drop.minecraft.emerald|stat.drop.minecraft.emerald_block|stat.drop.minecraft.emerald_ore|stat.drop.minecraft.enchanted_book|stat.drop.minecraft.enchanting_table|stat.drop.minecraft.end_bricks|stat.drop.minecraft.end_crystal|stat.drop.minecraft.end_portal_frame|stat.drop.minecraft.end_rod|stat.drop.minecraft.end_stone|stat.drop.minecraft.ender_chest|stat.drop.minecraft.ender_eye|stat.drop.minecraft.ender_pearl|stat.drop.minecraft.experience_bottle|stat.drop.minecraft.farmland|stat.drop.minecraft.feather|stat.drop.minecraft.fence|stat.drop.minecraft.fence_gate|stat.drop.minecraft.fermented_spider_eye|stat.drop.minecraft.filled_map|stat.drop.minecraft.fire_charge|stat.drop.minecraft.firework_charge|stat.drop.minecraft.fireworks|stat.drop.minecraft.fish|stat.drop.minecraft.fishing_rod|stat.drop.minecraft.flint|stat.drop.minecraft.flint_and_steel|stat.drop.minecraft.flower_pot|stat.drop.minecraft.furnace|stat.drop.minecraft.furnace_minecart|stat.drop.minecraft.ghast_tear|stat.drop.minecraft.glass|stat.drop.minecraft.glass_bottle|stat.drop.minecraft.glass_pane|stat.drop.minecraft.glowstone|stat.drop.minecraft.glowstone_dust|stat.drop.minecraft.gold_block|stat.drop.minecraft.gold_ingot|stat.drop.minecraft.gold_nugget|stat.drop.minecraft.gold_ore|stat.drop.minecraft.golden_apple|stat.drop.minecraft.golden_axe|stat.drop.minecraft.golden_boots|stat.drop.minecraft.golden_carrot|stat.drop.minecraft.golden_chestplate|stat.drop.minecraft.golden_helmet|stat.drop.minecraft.golden_hoe|stat.drop.minecraft.golden_horse_armor|stat.drop.minecraft.golden_leggings|stat.drop.minecraft.golden_pickaxe|stat.drop.minecraft.golden_rail|stat.drop.minecraft.golden_shovel|stat.drop.minecraft.golden_sword|stat.drop.minecraft.grass|stat.drop.minecraft.grass_path|stat.drop.minecraft.gravel|stat.drop.minecraft.gunpowder|stat.drop.minecraft.hardened_clay|stat.drop.minecraft.hay_block|stat.drop.minecraft.heavy_weighted_pressure_plate|stat.drop.minecraft.hopper|stat.drop.minecraft.hopper_minecart|stat.drop.minecraft.ice|stat.drop.minecraft.iron_axe|stat.drop.minecraft.iron_bars|stat.drop.minecraft.iron_block|stat.drop.minecraft.iron_boots|stat.drop.minecraft.iron_chestplate|stat.drop.minecraft.iron_door|stat.drop.minecraft.iron_helmet|stat.drop.minecraft.iron_hoe|stat.drop.minecraft.iron_horse_armor|stat.drop.minecraft.iron_ingot|stat.drop.minecraft.iron_leggings|stat.drop.minecraft.iron_ore|stat.drop.minecraft.iron_pickaxe|stat.drop.minecraft.iron_shovel|stat.drop.minecraft.iron_sword|stat.drop.minecraft.iron_trapdoor|stat.drop.minecraft.item_frame|stat.drop.minecraft.jukebox|stat.drop.minecraft.jungle_boat|stat.drop.minecraft.jungle_door|stat.drop.minecraft.jungle_fence|stat.drop.minecraft.jungle_fence_gate|stat.drop.minecraft.jungle_stairs|stat.drop.minecraft.ladder|stat.drop.minecraft.lapis_block|stat.drop.minecraft.lapis_ore|stat.drop.minecraft.lava_bucket|stat.drop.minecraft.lead|stat.drop.minecraft.leather|stat.drop.minecraft.leather_boots|stat.drop.minecraft.leather_chestplate|stat.drop.minecraft.leather_helmet|stat.drop.minecraft.leather_leggings|stat.drop.minecraft.leaves|stat.drop.minecraft.leaves2|stat.drop.minecraft.lever|stat.drop.minecraft.light_weighted_pressure_plate|stat.drop.minecraft.lingering_potion|stat.drop.minecraft.lit_pumpkin|stat.drop.minecraft.log|stat.drop.minecraft.log2|stat.drop.minecraft.magma|stat.drop.minecraft.magma_cream|stat.drop.minecraft.map|stat.drop.minecraft.melon|stat.drop.minecraft.melon_block|stat.drop.minecraft.melon_seeds|stat.drop.minecraft.milk_bucket|stat.drop.minecraft.minecart|stat.drop.minecraft.mob_spawner|stat.drop.minecraft.monster_egg|stat.drop.minecraft.mossy_cobblestone|stat.drop.minecraft.mushroom_stew|stat.drop.minecraft.mutton|stat.drop.minecraft.mycelium|stat.drop.minecraft.name_tag|stat.drop.minecraft.nether_brick|stat.drop.minecraft.nether_brick_fence|stat.drop.minecraft.nether_brick_stairs|stat.drop.minecraft.nether_star|stat.drop.minecraft.nether_wart|stat.drop.minecraft.nether_wart_block|stat.drop.minecraft.netherbrick|stat.drop.minecraft.netherrack|stat.drop.minecraft.noteblock|stat.drop.minecraft.oak_stairs|stat.drop.minecraft.obsidian|stat.drop.minecraft.packed_ice|stat.drop.minecraft.painting|stat.drop.minecraft.paper|stat.drop.minecraft.piston|stat.drop.minecraft.planks|stat.drop.minecraft.poisonous_potato|stat.drop.minecraft.porkchop|stat.drop.minecraft.potato|stat.drop.minecraft.potion|stat.drop.minecraft.prismarine|stat.drop.minecraft.prismarine_crystals|stat.drop.minecraft.prismarine_shard|stat.drop.minecraft.pumpkin|stat.drop.minecraft.pumpkin_pie|stat.drop.minecraft.pumpkin_seeds|stat.drop.minecraft.purpur_block|stat.drop.minecraft.purpur_pillar|stat.drop.minecraft.purpur_slab|stat.drop.minecraft.purpur_stairs|stat.drop.minecraft.quartz|stat.drop.minecraft.quartz_block|stat.drop.minecraft.quartz_ore|stat.drop.minecraft.quartz_stairs|stat.drop.minecraft.rabbit|stat.drop.minecraft.rabbit_foot|stat.drop.minecraft.rabbit_hide|stat.drop.minecraft.rabbit_stew|stat.drop.minecraft.rail|stat.drop.minecraft.record_11|stat.drop.minecraft.record_13|stat.drop.minecraft.record_blocks|stat.drop.minecraft.record_cat|stat.drop.minecraft.record_chirp|stat.drop.minecraft.record_far|stat.drop.minecraft.record_mall|stat.drop.minecraft.record_mellohi|stat.drop.minecraft.record_stal|stat.drop.minecraft.record_strad|stat.drop.minecraft.record_wait|stat.drop.minecraft.record_ward|stat.drop.minecraft.red_flower|stat.drop.minecraft.red_mushroom|stat.drop.minecraft.red_mushroom_block|stat.drop.minecraft.red_nether_brick|stat.drop.minecraft.red_sandstone|stat.drop.minecraft.red_sandstone_stairs|stat.drop.minecraft.redstone|stat.drop.minecraft.redstone_block|stat.drop.minecraft.redstone_lamp|stat.drop.minecraft.redstone_ore|stat.drop.minecraft.redstone_torch|stat.drop.minecraft.reeds|stat.drop.minecraft.repeater|stat.drop.minecraft.repeating_command_block|stat.drop.minecraft.rotten_flesh|stat.drop.minecraft.saddle|stat.drop.minecraft.sand|stat.drop.minecraft.sandstone|stat.drop.minecraft.sandstone_stairs|stat.drop.minecraft.sapling|stat.drop.minecraft.sea_lantern|stat.drop.minecraft.shears|stat.drop.minecraft.shield|stat.drop.minecraft.sign|stat.drop.minecraft.skull|stat.drop.minecraft.slime|stat.drop.minecraft.slime_ball|stat.drop.minecraft.snow|stat.drop.minecraft.snow_layer|stat.drop.minecraft.snowball|stat.drop.minecraft.soul_sand|stat.drop.minecraft.spawn_egg|stat.drop.minecraft.speckled_melon|stat.drop.minecraft.spectral_arrow|stat.drop.minecraft.spider_eye|stat.drop.minecraft.splash_potion|stat.drop.minecraft.sponge|stat.drop.minecraft.spruce_boat|stat.drop.minecraft.spruce_door|stat.drop.minecraft.spruce_fence|stat.drop.minecraft.spruce_fence_gate|stat.drop.minecraft.spruce_stairs|stat.drop.minecraft.stained_glass|stat.drop.minecraft.stained_glass_pane|stat.drop.minecraft.stained_hardened_clay|stat.drop.minecraft.stick|stat.drop.minecraft.sticky_piston|stat.drop.minecraft.stone|stat.drop.minecraft.stone_axe|stat.drop.minecraft.stone_brick_stairs|stat.drop.minecraft.stone_button|stat.drop.minecraft.stone_hoe|stat.drop.minecraft.stone_pickaxe|stat.drop.minecraft.stone_pressure_plate|stat.drop.minecraft.stone_shovel|stat.drop.minecraft.stone_slab|stat.drop.minecraft.stone_slab2|stat.drop.minecraft.stone_stairs|stat.drop.minecraft.stone_sword|stat.drop.minecraft.stonebrick|stat.drop.minecraft.string|stat.drop.minecraft.structure_block|stat.drop.minecraft.structure_void|stat.drop.minecraft.sugar|stat.drop.minecraft.tallgrass|stat.drop.minecraft.tipped_arrow|stat.drop.minecraft.tnt|stat.drop.minecraft.tnt_minecart|stat.drop.minecraft.torch|stat.drop.minecraft.trapdoor|stat.drop.minecraft.trapped_chest|stat.drop.minecraft.tripwire_hook|stat.drop.minecraft.vine|stat.drop.minecraft.water_bucket|stat.drop.minecraft.waterlily|stat.drop.minecraft.web|stat.drop.minecraft.wheat|stat.drop.minecraft.wheat_seeds|stat.drop.minecraft.wooden_axe|stat.drop.minecraft.wooden_button|stat.drop.minecraft.wooden_door|stat.drop.minecraft.wooden_hoe|stat.drop.minecraft.wooden_pickaxe|stat.drop.minecraft.wooden_pressure_plate|stat.drop.minecraft.wooden_shovel|stat.drop.minecraft.wooden_slab|stat.drop.minecraft.wooden_sword|stat.drop.minecraft.wool|stat.drop.minecraft.writable_book|stat.drop.minecraft.written_book|stat.drop.minecraft.yellow_flower|stat.dropperInspected|stat.enderchestOpened|stat.entityKilledBy.Bat|stat.entityKilledBy.Blaze|stat.entityKilledBy.CaveSpider|stat.entityKilledBy.Chicken|stat.entityKilledBy.Cow|stat.entityKilledBy.Creeper|stat.entityKilledBy.Enderman|stat.entityKilledBy.Endermite|stat.entityKilledBy.EntityHorse|stat.entityKilledBy.Ghast|stat.entityKilledBy.Guardian|stat.entityKilledBy.LavaSlime|stat.entityKilledBy.MushroomCow|stat.entityKilledBy.Ozelot|stat.entityKilledBy.Pig|stat.entityKilledBy.PigZombie|stat.entityKilledBy.PolarBear|stat.entityKilledBy.Rabbit|stat.entityKilledBy.Sheep|stat.entityKilledBy.Shulker|stat.entityKilledBy.Silverfish|stat.entityKilledBy.Skeleton|stat.entityKilledBy.Slime|stat.entityKilledBy.Spider|stat.entityKilledBy.Squid|stat.entityKilledBy.Villager|stat.entityKilledBy.Witch|stat.entityKilledBy.Wolf|stat.entityKilledBy.Zombie|stat.fallOneCm|stat.fishCaught|stat.flowerPotted|stat.flyOneCm|stat.furnaceInteraction|stat.hopperInspected|stat.horseOneCm|stat.itemEnchanted|stat.jump|stat.junkFished|stat.killEntity.Bat|stat.killEntity.Blaze|stat.killEntity.CaveSpider|stat.killEntity.Chicken|stat.killEntity.Cow|stat.killEntity.Creeper|stat.killEntity.Enderman|stat.killEntity.Endermite|stat.killEntity.EntityHorse|stat.killEntity.Ghast|stat.killEntity.Guardian|stat.killEntity.LavaSlime|stat.killEntity.MushroomCow|stat.killEntity.Ozelot|stat.killEntity.Pig|stat.killEntity.PigZombie|stat.killEntity.PolarBear|stat.killEntity.Rabbit|stat.killEntity.Sheep|stat.killEntity.Shulker|stat.killEntity.Silverfish|stat.killEntity.Skeleton|stat.killEntity.Slime|stat.killEntity.Spider|stat.killEntity.Squid|stat.killEntity.Villager|stat.killEntity.Witch|stat.killEntity.Wolf|stat.killEntity.Zombie|stat.leaveGame|stat.mineBlock.minecraft.acacia_fence|stat.mineBlock.minecraft.acacia_fence_gate|stat.mineBlock.minecraft.acacia_stairs|stat.mineBlock.minecraft.activator_rail|stat.mineBlock.minecraft.anvil|stat.mineBlock.minecraft.beacon|stat.mineBlock.minecraft.birch_fence|stat.mineBlock.minecraft.birch_fence_gate|stat.mineBlock.minecraft.birch_stairs|stat.mineBlock.minecraft.bone_block|stat.mineBlock.minecraft.bookshelf|stat.mineBlock.minecraft.brick_block|stat.mineBlock.minecraft.brick_stairs|stat.mineBlock.minecraft.brown_mushroom|stat.mineBlock.minecraft.brown_mushroom_block|stat.mineBlock.minecraft.cactus|stat.mineBlock.minecraft.carpet|stat.mineBlock.minecraft.chain_command_block|stat.mineBlock.minecraft.chest|stat.mineBlock.minecraft.chorus_flower|stat.mineBlock.minecraft.chorus_plant|stat.mineBlock.minecraft.clay|stat.mineBlock.minecraft.coal_block|stat.mineBlock.minecraft.coal_ore|stat.mineBlock.minecraft.cobblestone|stat.mineBlock.minecraft.cobblestone_wall|stat.mineBlock.minecraft.command_block|stat.mineBlock.minecraft.crafting_table|stat.mineBlock.minecraft.dark_oak_fence|stat.mineBlock.minecraft.dark_oak_fence_gate|stat.mineBlock.minecraft.dark_oak_stairs|stat.mineBlock.minecraft.daylight_detector|stat.mineBlock.minecraft.deadbush|stat.mineBlock.minecraft.detector_rail|stat.mineBlock.minecraft.diamond_block|stat.mineBlock.minecraft.diamond_ore|stat.mineBlock.minecraft.dirt|stat.mineBlock.minecraft.dispenser|stat.mineBlock.minecraft.double_plant|stat.mineBlock.minecraft.dragon_egg|stat.mineBlock.minecraft.dropper|stat.mineBlock.minecraft.emerald_block|stat.mineBlock.minecraft.emerald_ore|stat.mineBlock.minecraft.enchanting_table|stat.mineBlock.minecraft.end_bricks|stat.mineBlock.minecraft.end_portal_frame|stat.mineBlock.minecraft.end_rod|stat.mineBlock.minecraft.end_stone|stat.mineBlock.minecraft.ender_chest|stat.mineBlock.minecraft.farmland|stat.mineBlock.minecraft.fence|stat.mineBlock.minecraft.fence_gate|stat.mineBlock.minecraft.furnace|stat.mineBlock.minecraft.glass|stat.mineBlock.minecraft.glass_pane|stat.mineBlock.minecraft.glowstone|stat.mineBlock.minecraft.gold_block|stat.mineBlock.minecraft.gold_ore|stat.mineBlock.minecraft.golden_rail|stat.mineBlock.minecraft.grass|stat.mineBlock.minecraft.gravel|stat.mineBlock.minecraft.hardened_clay|stat.mineBlock.minecraft.hay_block|stat.mineBlock.minecraft.heavy_weighted_pressure_plate|stat.mineBlock.minecraft.hopper|stat.mineBlock.minecraft.ice|stat.mineBlock.minecraft.iron_bars|stat.mineBlock.minecraft.iron_block|stat.mineBlock.minecraft.iron_ore|stat.mineBlock.minecraft.jukebox|stat.mineBlock.minecraft.jungle_fence|stat.mineBlock.minecraft.jungle_fence_gate|stat.mineBlock.minecraft.jungle_stairs|stat.mineBlock.minecraft.ladder|stat.mineBlock.minecraft.lapis_block|stat.mineBlock.minecraft.lapis_ore|stat.mineBlock.minecraft.leaves|stat.mineBlock.minecraft.leaves2|stat.mineBlock.minecraft.lever|stat.mineBlock.minecraft.light_weighted_pressure_plate|stat.mineBlock.minecraft.lit_pumpkin|stat.mineBlock.minecraft.log|stat.mineBlock.minecraft.log2|stat.mineBlock.minecraft.magma|stat.mineBlock.minecraft.melon_block|stat.mineBlock.minecraft.monster_egg|stat.mineBlock.minecraft.mossy_cobblestone|stat.mineBlock.minecraft.mycelium|stat.mineBlock.minecraft.nether_brick|stat.mineBlock.minecraft.nether_brick_fence|stat.mineBlock.minecraft.nether_brick_stairs|stat.mineBlock.minecraft.nether_wart_block|stat.mineBlock.minecraft.netherrack|stat.mineBlock.minecraft.noteblock|stat.mineBlock.minecraft.oak_stairs|stat.mineBlock.minecraft.obsidian|stat.mineBlock.minecraft.packed_ice|stat.mineBlock.minecraft.piston|stat.mineBlock.minecraft.planks|stat.mineBlock.minecraft.prismarine|stat.mineBlock.minecraft.pumpkin|stat.mineBlock.minecraft.purpur_block|stat.mineBlock.minecraft.purpur_pillar|stat.mineBlock.minecraft.purpur_slab|stat.mineBlock.minecraft.purpur_stairs|stat.mineBlock.minecraft.quartz_block|stat.mineBlock.minecraft.quartz_ore|stat.mineBlock.minecraft.quartz_stairs|stat.mineBlock.minecraft.rail|stat.mineBlock.minecraft.red_flower|stat.mineBlock.minecraft.red_mushroom|stat.mineBlock.minecraft.red_mushroom_block|stat.mineBlock.minecraft.red_nether_brick|stat.mineBlock.minecraft.red_sandstone|stat.mineBlock.minecraft.red_sandstone_stairs|stat.mineBlock.minecraft.redstone_block|stat.mineBlock.minecraft.redstone_lamp|stat.mineBlock.minecraft.redstone_ore|stat.mineBlock.minecraft.redstone_torch|stat.mineBlock.minecraft.repeating_command_block|stat.mineBlock.minecraft.sand|stat.mineBlock.minecraft.sandstone|stat.mineBlock.minecraft.sandstone_stairs|stat.mineBlock.minecraft.sapling|stat.mineBlock.minecraft.sea_lantern|stat.mineBlock.minecraft.slime|stat.mineBlock.minecraft.snow|stat.mineBlock.minecraft.snow_layer|stat.mineBlock.minecraft.soul_sand|stat.mineBlock.minecraft.sponge|stat.mineBlock.minecraft.spruce_fence|stat.mineBlock.minecraft.spruce_fence_gate|stat.mineBlock.minecraft.spruce_stairs|stat.mineBlock.minecraft.stained_glass|stat.mineBlock.minecraft.stained_glass_pane|stat.mineBlock.minecraft.stained_hardened_clay|stat.mineBlock.minecraft.sticky_piston|stat.mineBlock.minecraft.stone|stat.mineBlock.minecraft.stone_brick_stairs|stat.mineBlock.minecraft.stone_button|stat.mineBlock.minecraft.stone_pressure_plate|stat.mineBlock.minecraft.stone_slab|stat.mineBlock.minecraft.stone_slab2|stat.mineBlock.minecraft.stone_stairs|stat.mineBlock.minecraft.stonebrick|stat.mineBlock.minecraft.structure_block|stat.mineBlock.minecraft.structure_void|stat.mineBlock.minecraft.tallgrass|stat.mineBlock.minecraft.tnt|stat.mineBlock.minecraft.torch|stat.mineBlock.minecraft.trapped_chest|stat.mineBlock.minecraft.tripwire_hook|stat.mineBlock.minecraft.vine|stat.mineBlock.minecraft.waterlily|stat.mineBlock.minecraft.web|stat.mineBlock.minecraft.wooden_button|stat.mineBlock.minecraft.wooden_pressure_plate|stat.mineBlock.minecraft.wooden_slab|stat.mineBlock.minecraft.wool|stat.mineBlock.minecraft.yellow_flower|stat.minecartOneCm|stat.mobKills|stat.noteblockPlayed|stat.noteblockTuned|stat.pickup.minecraft.acacia_boat|stat.pickup.minecraft.acacia_door|stat.pickup.minecraft.acacia_fence|stat.pickup.minecraft.acacia_fence_gate|stat.pickup.minecraft.acacia_stairs|stat.pickup.minecraft.activator_rail|stat.pickup.minecraft.anvil|stat.pickup.minecraft.apple|stat.pickup.minecraft.armor_stand|stat.pickup.minecraft.arrow|stat.pickup.minecraft.baked_potato|stat.pickup.minecraft.banner|stat.pickup.minecraft.barrier|stat.pickup.minecraft.beacon|stat.pickup.minecraft.bed|stat.pickup.minecraft.bedrock|stat.pickup.minecraft.beef|stat.pickup.minecraft.beetroot|stat.pickup.minecraft.beetroot_seeds|stat.pickup.minecraft.beetroot_soup|stat.pickup.minecraft.birch_boat|stat.pickup.minecraft.birch_door|stat.pickup.minecraft.birch_fence|stat.pickup.minecraft.birch_fence_gate|stat.pickup.minecraft.birch_stairs|stat.pickup.minecraft.blaze_powder|stat.pickup.minecraft.blaze_rod|stat.pickup.minecraft.boat|stat.pickup.minecraft.bone|stat.pickup.minecraft.bone_block|stat.pickup.minecraft.book|stat.pickup.minecraft.bookshelf|stat.pickup.minecraft.bow|stat.pickup.minecraft.bowl|stat.pickup.minecraft.bread|stat.pickup.minecraft.brewing_stand|stat.pickup.minecraft.brick|stat.pickup.minecraft.brick_block|stat.pickup.minecraft.brick_stairs|stat.pickup.minecraft.brown_mushroom|stat.pickup.minecraft.brown_mushroom_block|stat.pickup.minecraft.bucket|stat.pickup.minecraft.cactus|stat.pickup.minecraft.cake|stat.pickup.minecraft.carpet|stat.pickup.minecraft.carrot|stat.pickup.minecraft.carrot_on_a_stick|stat.pickup.minecraft.cauldron|stat.pickup.minecraft.chain_command_block|stat.pickup.minecraft.chainmail_boots|stat.pickup.minecraft.chainmail_chestplate|stat.pickup.minecraft.chainmail_helmet|stat.pickup.minecraft.chainmail_leggings|stat.pickup.minecraft.chest|stat.pickup.minecraft.chest_minecart|stat.pickup.minecraft.chicken|stat.pickup.minecraft.chorus_flower|stat.pickup.minecraft.chorus_fruit|stat.pickup.minecraft.chorus_fruit_popped|stat.pickup.minecraft.chorus_plant|stat.pickup.minecraft.clay|stat.pickup.minecraft.clay_ball|stat.pickup.minecraft.clock|stat.pickup.minecraft.coal|stat.pickup.minecraft.coal_block|stat.pickup.minecraft.coal_ore|stat.pickup.minecraft.cobblestone|stat.pickup.minecraft.cobblestone_wall|stat.pickup.minecraft.command_block|stat.pickup.minecraft.command_block_minecart|stat.pickup.minecraft.comparator|stat.pickup.minecraft.compass|stat.pickup.minecraft.cooked_beef|stat.pickup.minecraft.cooked_chicken|stat.pickup.minecraft.cooked_fish|stat.pickup.minecraft.cooked_mutton|stat.pickup.minecraft.cooked_porkchop|stat.pickup.minecraft.cooked_rabbit|stat.pickup.minecraft.cookie|stat.pickup.minecraft.crafting_table|stat.pickup.minecraft.dark_oak_boat|stat.pickup.minecraft.dark_oak_door|stat.pickup.minecraft.dark_oak_fence|stat.pickup.minecraft.dark_oak_fence_gate|stat.pickup.minecraft.dark_oak_stairs|stat.pickup.minecraft.daylight_detector|stat.pickup.minecraft.deadbush|stat.pickup.minecraft.detector_rail|stat.pickup.minecraft.diamond|stat.pickup.minecraft.diamond_axe|stat.pickup.minecraft.diamond_block|stat.pickup.minecraft.diamond_boots|stat.pickup.minecraft.diamond_chestplate|stat.pickup.minecraft.diamond_helmet|stat.pickup.minecraft.diamond_hoe|stat.pickup.minecraft.diamond_horse_armor|stat.pickup.minecraft.diamond_leggings|stat.pickup.minecraft.diamond_ore|stat.pickup.minecraft.diamond_pickaxe|stat.pickup.minecraft.diamond_shovel|stat.pickup.minecraft.diamond_sword|stat.pickup.minecraft.dirt|stat.pickup.minecraft.dispenser|stat.pickup.minecraft.double_plant|stat.pickup.minecraft.dragon_breath|stat.pickup.minecraft.dragon_egg|stat.pickup.minecraft.dropper|stat.pickup.minecraft.dye|stat.pickup.minecraft.egg|stat.pickup.minecraft.elytra|stat.pickup.minecraft.emerald|stat.pickup.minecraft.emerald_block|stat.pickup.minecraft.emerald_ore|stat.pickup.minecraft.enchanted_book|stat.pickup.minecraft.enchanting_table|stat.pickup.minecraft.end_bricks|stat.pickup.minecraft.end_crystal|stat.pickup.minecraft.end_portal_frame|stat.pickup.minecraft.end_rod|stat.pickup.minecraft.end_stone|stat.pickup.minecraft.ender_chest|stat.pickup.minecraft.ender_eye|stat.pickup.minecraft.ender_pearl|stat.pickup.minecraft.experience_bottle|stat.pickup.minecraft.farmland|stat.pickup.minecraft.feather|stat.pickup.minecraft.fence|stat.pickup.minecraft.fence_gate|stat.pickup.minecraft.fermented_spider_eye|stat.pickup.minecraft.filled_map|stat.pickup.minecraft.fire_charge|stat.pickup.minecraft.firework_charge|stat.pickup.minecraft.fireworks|stat.pickup.minecraft.fish|stat.pickup.minecraft.fishing_rod|stat.pickup.minecraft.flint|stat.pickup.minecraft.flint_and_steel|stat.pickup.minecraft.flower_pot|stat.pickup.minecraft.furnace|stat.pickup.minecraft.furnace_minecart|stat.pickup.minecraft.ghast_tear|stat.pickup.minecraft.glass|stat.pickup.minecraft.glass_bottle|stat.pickup.minecraft.glass_pane|stat.pickup.minecraft.glowstone|stat.pickup.minecraft.glowstone_dust|stat.pickup.minecraft.gold_block|stat.pickup.minecraft.gold_ingot|stat.pickup.minecraft.gold_nugget|stat.pickup.minecraft.gold_ore|stat.pickup.minecraft.golden_apple|stat.pickup.minecraft.golden_axe|stat.pickup.minecraft.golden_boots|stat.pickup.minecraft.golden_carrot|stat.pickup.minecraft.golden_chestplate|stat.pickup.minecraft.golden_helmet|stat.pickup.minecraft.golden_hoe|stat.pickup.minecraft.golden_horse_armor|stat.pickup.minecraft.golden_leggings|stat.pickup.minecraft.golden_pickaxe|stat.pickup.minecraft.golden_rail|stat.pickup.minecraft.golden_shovel|stat.pickup.minecraft.golden_sword|stat.pickup.minecraft.grass|stat.pickup.minecraft.grass_path|stat.pickup.minecraft.gravel|stat.pickup.minecraft.gunpowder|stat.pickup.minecraft.hardened_clay|stat.pickup.minecraft.hay_block|stat.pickup.minecraft.heavy_weighted_pressure_plate|stat.pickup.minecraft.hopper|stat.pickup.minecraft.hopper_minecart|stat.pickup.minecraft.ice|stat.pickup.minecraft.iron_axe|stat.pickup.minecraft.iron_bars|stat.pickup.minecraft.iron_block|stat.pickup.minecraft.iron_boots|stat.pickup.minecraft.iron_chestplate|stat.pickup.minecraft.iron_door|stat.pickup.minecraft.iron_helmet|stat.pickup.minecraft.iron_hoe|stat.pickup.minecraft.iron_horse_armor|stat.pickup.minecraft.iron_ingot|stat.pickup.minecraft.iron_leggings|stat.pickup.minecraft.iron_ore|stat.pickup.minecraft.iron_pickaxe|stat.pickup.minecraft.iron_shovel|stat.pickup.minecraft.iron_sword|stat.pickup.minecraft.iron_trapdoor|stat.pickup.minecraft.item_frame|stat.pickup.minecraft.jukebox|stat.pickup.minecraft.jungle_boat|stat.pickup.minecraft.jungle_door|stat.pickup.minecraft.jungle_fence|stat.pickup.minecraft.jungle_fence_gate|stat.pickup.minecraft.jungle_stairs|stat.pickup.minecraft.ladder|stat.pickup.minecraft.lapis_block|stat.pickup.minecraft.lapis_ore|stat.pickup.minecraft.lava_bucket|stat.pickup.minecraft.lead|stat.pickup.minecraft.leather|stat.pickup.minecraft.leather_boots|stat.pickup.minecraft.leather_chestplate|stat.pickup.minecraft.leather_helmet|stat.pickup.minecraft.leather_leggings|stat.pickup.minecraft.leaves|stat.pickup.minecraft.leaves2|stat.pickup.minecraft.lever|stat.pickup.minecraft.light_weighted_pressure_plate|stat.pickup.minecraft.lingering_potion|stat.pickup.minecraft.lit_pumpkin|stat.pickup.minecraft.log|stat.pickup.minecraft.log2|stat.pickup.minecraft.magma|stat.pickup.minecraft.magma_cream|stat.pickup.minecraft.map|stat.pickup.minecraft.melon|stat.pickup.minecraft.melon_block|stat.pickup.minecraft.melon_seeds|stat.pickup.minecraft.milk_bucket|stat.pickup.minecraft.minecart|stat.pickup.minecraft.mob_spawner|stat.pickup.minecraft.monster_egg|stat.pickup.minecraft.mossy_cobblestone|stat.pickup.minecraft.mushroom_stew|stat.pickup.minecraft.mutton|stat.pickup.minecraft.mycelium|stat.pickup.minecraft.name_tag|stat.pickup.minecraft.nether_brick|stat.pickup.minecraft.nether_brick_fence|stat.pickup.minecraft.nether_brick_stairs|stat.pickup.minecraft.nether_star|stat.pickup.minecraft.nether_wart|stat.pickup.minecraft.nether_wart_block|stat.pickup.minecraft.netherbrick|stat.pickup.minecraft.netherrack|stat.pickup.minecraft.noteblock|stat.pickup.minecraft.oak_stairs|stat.pickup.minecraft.obsidian|stat.pickup.minecraft.packed_ice|stat.pickup.minecraft.painting|stat.pickup.minecraft.paper|stat.pickup.minecraft.piston|stat.pickup.minecraft.planks|stat.pickup.minecraft.poisonous_potato|stat.pickup.minecraft.porkchop|stat.pickup.minecraft.potato|stat.pickup.minecraft.potion|stat.pickup.minecraft.prismarine|stat.pickup.minecraft.prismarine_crystals|stat.pickup.minecraft.prismarine_shard|stat.pickup.minecraft.pumpkin|stat.pickup.minecraft.pumpkin_pie|stat.pickup.minecraft.pumpkin_seeds|stat.pickup.minecraft.purpur_block|stat.pickup.minecraft.purpur_pillar|stat.pickup.minecraft.purpur_slab|stat.pickup.minecraft.purpur_stairs|stat.pickup.minecraft.quartz|stat.pickup.minecraft.quartz_block|stat.pickup.minecraft.quartz_ore|stat.pickup.minecraft.quartz_stairs|stat.pickup.minecraft.rabbit|stat.pickup.minecraft.rabbit_foot|stat.pickup.minecraft.rabbit_hide|stat.pickup.minecraft.rabbit_stew|stat.pickup.minecraft.rail|stat.pickup.minecraft.record_11|stat.pickup.minecraft.record_13|stat.pickup.minecraft.record_blocks|stat.pickup.minecraft.record_cat|stat.pickup.minecraft.record_chirp|stat.pickup.minecraft.record_far|stat.pickup.minecraft.record_mall|stat.pickup.minecraft.record_mellohi|stat.pickup.minecraft.record_stal|stat.pickup.minecraft.record_strad|stat.pickup.minecraft.record_wait|stat.pickup.minecraft.record_ward|stat.pickup.minecraft.red_flower|stat.pickup.minecraft.red_mushroom|stat.pickup.minecraft.red_mushroom_block|stat.pickup.minecraft.red_nether_brick|stat.pickup.minecraft.red_sandstone|stat.pickup.minecraft.red_sandstone_stairs|stat.pickup.minecraft.redstone|stat.pickup.minecraft.redstone_block|stat.pickup.minecraft.redstone_lamp|stat.pickup.minecraft.redstone_ore|stat.pickup.minecraft.redstone_torch|stat.pickup.minecraft.reeds|stat.pickup.minecraft.repeater|stat.pickup.minecraft.repeating_command_block|stat.pickup.minecraft.rotten_flesh|stat.pickup.minecraft.saddle|stat.pickup.minecraft.sand|stat.pickup.minecraft.sandstone|stat.pickup.minecraft.sandstone_stairs|stat.pickup.minecraft.sapling|stat.pickup.minecraft.sea_lantern|stat.pickup.minecraft.shears|stat.pickup.minecraft.shield|stat.pickup.minecraft.sign|stat.pickup.minecraft.skull|stat.pickup.minecraft.slime|stat.pickup.minecraft.slime_ball|stat.pickup.minecraft.snow|stat.pickup.minecraft.snow_layer|stat.pickup.minecraft.snowball|stat.pickup.minecraft.soul_sand|stat.pickup.minecraft.spawn_egg|stat.pickup.minecraft.speckled_melon|stat.pickup.minecraft.spectral_arrow|stat.pickup.minecraft.spider_eye|stat.pickup.minecraft.splash_potion|stat.pickup.minecraft.sponge|stat.pickup.minecraft.spruce_boat|stat.pickup.minecraft.spruce_door|stat.pickup.minecraft.spruce_fence|stat.pickup.minecraft.spruce_fence_gate|stat.pickup.minecraft.spruce_stairs|stat.pickup.minecraft.stained_glass|stat.pickup.minecraft.stained_glass_pane|stat.pickup.minecraft.stained_hardened_clay|stat.pickup.minecraft.stick|stat.pickup.minecraft.sticky_piston|stat.pickup.minecraft.stone|stat.pickup.minecraft.stone_axe|stat.pickup.minecraft.stone_brick_stairs|stat.pickup.minecraft.stone_button|stat.pickup.minecraft.stone_hoe|stat.pickup.minecraft.stone_pickaxe|stat.pickup.minecraft.stone_pressure_plate|stat.pickup.minecraft.stone_shovel|stat.pickup.minecraft.stone_slab|stat.pickup.minecraft.stone_slab2|stat.pickup.minecraft.stone_stairs|stat.pickup.minecraft.stone_sword|stat.pickup.minecraft.stonebrick|stat.pickup.minecraft.string|stat.pickup.minecraft.structure_block|stat.pickup.minecraft.structure_void|stat.pickup.minecraft.sugar|stat.pickup.minecraft.tallgrass|stat.pickup.minecraft.tipped_arrow|stat.pickup.minecraft.tnt|stat.pickup.minecraft.tnt_minecart|stat.pickup.minecraft.torch|stat.pickup.minecraft.trapdoor|stat.pickup.minecraft.trapped_chest|stat.pickup.minecraft.tripwire_hook|stat.pickup.minecraft.vine|stat.pickup.minecraft.water_bucket|stat.pickup.minecraft.waterlily|stat.pickup.minecraft.web|stat.pickup.minecraft.wheat|stat.pickup.minecraft.wheat_seeds|stat.pickup.minecraft.wooden_axe|stat.pickup.minecraft.wooden_button|stat.pickup.minecraft.wooden_door|stat.pickup.minecraft.wooden_hoe|stat.pickup.minecraft.wooden_pickaxe|stat.pickup.minecraft.wooden_pressure_plate|stat.pickup.minecraft.wooden_shovel|stat.pickup.minecraft.wooden_slab|stat.pickup.minecraft.wooden_sword|stat.pickup.minecraft.wool|stat.pickup.minecraft.writable_book|stat.pickup.minecraft.written_book|stat.pickup.minecraft.yellow_flower|stat.pigOneCm|stat.playOneMinute|stat.playerKills|stat.recordPlayed|stat.sleepInBed|stat.sneakTime|stat.sprintOneCm|stat.swimOneCm|stat.talkedToVillager|stat.timeSinceDeath|stat.tradedWithVillager|stat.trappedChestTriggered|stat.treasureFished|stat.useItem.minecraft.acacia_boat|stat.useItem.minecraft.acacia_door|stat.useItem.minecraft.acacia_fence|stat.useItem.minecraft.acacia_fence_gate|stat.useItem.minecraft.acacia_stairs|stat.useItem.minecraft.activator_rail|stat.useItem.minecraft.anvil|stat.useItem.minecraft.apple|stat.useItem.minecraft.armor_stand|stat.useItem.minecraft.arrow|stat.useItem.minecraft.baked_potato|stat.useItem.minecraft.banner|stat.useItem.minecraft.barrier|stat.useItem.minecraft.beacon|stat.useItem.minecraft.bed|stat.useItem.minecraft.bedrock|stat.useItem.minecraft.beef|stat.useItem.minecraft.beetroot|stat.useItem.minecraft.beetroot_seeds|stat.useItem.minecraft.beetroot_soup|stat.useItem.minecraft.birch_boat|stat.useItem.minecraft.birch_door|stat.useItem.minecraft.birch_fence|stat.useItem.minecraft.birch_fence_gate|stat.useItem.minecraft.birch_stairs|stat.useItem.minecraft.blaze_powder|stat.useItem.minecraft.blaze_rod|stat.useItem.minecraft.boat|stat.useItem.minecraft.bone|stat.useItem.minecraft.bone_block|stat.useItem.minecraft.book|stat.useItem.minecraft.bookshelf|stat.useItem.minecraft.bow|stat.useItem.minecraft.bowl|stat.useItem.minecraft.bread|stat.useItem.minecraft.brewing_stand|stat.useItem.minecraft.brick|stat.useItem.minecraft.brick_block|stat.useItem.minecraft.brick_stairs|stat.useItem.minecraft.brown_mushroom|stat.useItem.minecraft.brown_mushroom_block|stat.useItem.minecraft.bucket|stat.useItem.minecraft.cactus|stat.useItem.minecraft.cake|stat.useItem.minecraft.carpet|stat.useItem.minecraft.carrot|stat.useItem.minecraft.carrot_on_a_stick|stat.useItem.minecraft.cauldron|stat.useItem.minecraft.chain_command_block|stat.useItem.minecraft.chainmail_boots|stat.useItem.minecraft.chainmail_chestplate|stat.useItem.minecraft.chainmail_helmet|stat.useItem.minecraft.chainmail_leggings|stat.useItem.minecraft.chest|stat.useItem.minecraft.chest_minecart|stat.useItem.minecraft.chicken|stat.useItem.minecraft.chorus_flower|stat.useItem.minecraft.chorus_fruit|stat.useItem.minecraft.chorus_fruit_popped|stat.useItem.minecraft.chorus_plant|stat.useItem.minecraft.clay|stat.useItem.minecraft.clay_ball|stat.useItem.minecraft.clock|stat.useItem.minecraft.coal|stat.useItem.minecraft.coal_block|stat.useItem.minecraft.coal_ore|stat.useItem.minecraft.cobblestone|stat.useItem.minecraft.cobblestone_wall|stat.useItem.minecraft.command_block|stat.useItem.minecraft.command_block_minecart|stat.useItem.minecraft.comparator|stat.useItem.minecraft.compass|stat.useItem.minecraft.cooked_beef|stat.useItem.minecraft.cooked_chicken|stat.useItem.minecraft.cooked_fish|stat.useItem.minecraft.cooked_mutton|stat.useItem.minecraft.cooked_porkchop|stat.useItem.minecraft.cooked_rabbit|stat.useItem.minecraft.cookie|stat.useItem.minecraft.crafting_table|stat.useItem.minecraft.dark_oak_boat|stat.useItem.minecraft.dark_oak_door|stat.useItem.minecraft.dark_oak_fence|stat.useItem.minecraft.dark_oak_fence_gate|stat.useItem.minecraft.dark_oak_stairs|stat.useItem.minecraft.daylight_detector|stat.useItem.minecraft.deadbush|stat.useItem.minecraft.detector_rail|stat.useItem.minecraft.diamond|stat.useItem.minecraft.diamond_axe|stat.useItem.minecraft.diamond_block|stat.useItem.minecraft.diamond_boots|stat.useItem.minecraft.diamond_chestplate|stat.useItem.minecraft.diamond_helmet|stat.useItem.minecraft.diamond_hoe|stat.useItem.minecraft.diamond_horse_armor|stat.useItem.minecraft.diamond_leggings|stat.useItem.minecraft.diamond_ore|stat.useItem.minecraft.diamond_pickaxe|stat.useItem.minecraft.diamond_shovel|stat.useItem.minecraft.diamond_sword|stat.useItem.minecraft.dirt|stat.useItem.minecraft.dispenser|stat.useItem.minecraft.double_plant|stat.useItem.minecraft.dragon_breath|stat.useItem.minecraft.dragon_egg|stat.useItem.minecraft.dropper|stat.useItem.minecraft.dye|stat.useItem.minecraft.egg|stat.useItem.minecraft.elytra|stat.useItem.minecraft.emerald|stat.useItem.minecraft.emerald_block|stat.useItem.minecraft.emerald_ore|stat.useItem.minecraft.enchanted_book|stat.useItem.minecraft.enchanting_table|stat.useItem.minecraft.end_bricks|stat.useItem.minecraft.end_crystal|stat.useItem.minecraft.end_portal_frame|stat.useItem.minecraft.end_rod|stat.useItem.minecraft.end_stone|stat.useItem.minecraft.ender_chest|stat.useItem.minecraft.ender_eye|stat.useItem.minecraft.ender_pearl|stat.useItem.minecraft.experience_bottle|stat.useItem.minecraft.farmland|stat.useItem.minecraft.feather|stat.useItem.minecraft.fence|stat.useItem.minecraft.fence_gate|stat.useItem.minecraft.fermented_spider_eye|stat.useItem.minecraft.filled_map|stat.useItem.minecraft.fire_charge|stat.useItem.minecraft.firework_charge|stat.useItem.minecraft.fireworks|stat.useItem.minecraft.fish|stat.useItem.minecraft.fishing_rod|stat.useItem.minecraft.flint|stat.useItem.minecraft.flint_and_steel|stat.useItem.minecraft.flower_pot|stat.useItem.minecraft.furnace|stat.useItem.minecraft.furnace_minecart|stat.useItem.minecraft.ghast_tear|stat.useItem.minecraft.glass|stat.useItem.minecraft.glass_bottle|stat.useItem.minecraft.glass_pane|stat.useItem.minecraft.glowstone|stat.useItem.minecraft.glowstone_dust|stat.useItem.minecraft.gold_block|stat.useItem.minecraft.gold_ingot|stat.useItem.minecraft.gold_nugget|stat.useItem.minecraft.gold_ore|stat.useItem.minecraft.golden_apple|stat.useItem.minecraft.golden_axe|stat.useItem.minecraft.golden_boots|stat.useItem.minecraft.golden_carrot|stat.useItem.minecraft.golden_chestplate|stat.useItem.minecraft.golden_helmet|stat.useItem.minecraft.golden_hoe|stat.useItem.minecraft.golden_horse_armor|stat.useItem.minecraft.golden_leggings|stat.useItem.minecraft.golden_pickaxe|stat.useItem.minecraft.golden_rail|stat.useItem.minecraft.golden_shovel|stat.useItem.minecraft.golden_sword|stat.useItem.minecraft.grass|stat.useItem.minecraft.grass_path|stat.useItem.minecraft.gravel|stat.useItem.minecraft.gunpowder|stat.useItem.minecraft.hardened_clay|stat.useItem.minecraft.hay_block|stat.useItem.minecraft.heavy_weighted_pressure_plate|stat.useItem.minecraft.hopper|stat.useItem.minecraft.hopper_minecart|stat.useItem.minecraft.ice|stat.useItem.minecraft.iron_axe|stat.useItem.minecraft.iron_bars|stat.useItem.minecraft.iron_block|stat.useItem.minecraft.iron_boots|stat.useItem.minecraft.iron_chestplate|stat.useItem.minecraft.iron_door|stat.useItem.minecraft.iron_helmet|stat.useItem.minecraft.iron_hoe|stat.useItem.minecraft.iron_horse_armor|stat.useItem.minecraft.iron_ingot|stat.useItem.minecraft.iron_leggings|stat.useItem.minecraft.iron_ore|stat.useItem.minecraft.iron_pickaxe|stat.useItem.minecraft.iron_shovel|stat.useItem.minecraft.iron_sword|stat.useItem.minecraft.iron_trapdoor|stat.useItem.minecraft.item_frame|stat.useItem.minecraft.jukebox|stat.useItem.minecraft.jungle_boat|stat.useItem.minecraft.jungle_door|stat.useItem.minecraft.jungle_fence|stat.useItem.minecraft.jungle_fence_gate|stat.useItem.minecraft.jungle_stairs|stat.useItem.minecraft.ladder|stat.useItem.minecraft.lapis_block|stat.useItem.minecraft.lapis_ore|stat.useItem.minecraft.lava_bucket|stat.useItem.minecraft.lead|stat.useItem.minecraft.leather|stat.useItem.minecraft.leather_boots|stat.useItem.minecraft.leather_chestplate|stat.useItem.minecraft.leather_helmet|stat.useItem.minecraft.leather_leggings|stat.useItem.minecraft.leaves|stat.useItem.minecraft.leaves2|stat.useItem.minecraft.lever|stat.useItem.minecraft.light_weighted_pressure_plate|stat.useItem.minecraft.lingering_potion|stat.useItem.minecraft.lit_pumpkin|stat.useItem.minecraft.log|stat.useItem.minecraft.log2|stat.useItem.minecraft.magma|stat.useItem.minecraft.magma_cream|stat.useItem.minecraft.map|stat.useItem.minecraft.melon|stat.useItem.minecraft.melon_block|stat.useItem.minecraft.melon_seeds|stat.useItem.minecraft.milk_bucket|stat.useItem.minecraft.minecart|stat.useItem.minecraft.mob_spawner|stat.useItem.minecraft.monster_egg|stat.useItem.minecraft.mossy_cobblestone|stat.useItem.minecraft.mushroom_stew|stat.useItem.minecraft.mutton|stat.useItem.minecraft.mycelium|stat.useItem.minecraft.name_tag|stat.useItem.minecraft.nether_brick|stat.useItem.minecraft.nether_brick_fence|stat.useItem.minecraft.nether_brick_stairs|stat.useItem.minecraft.nether_star|stat.useItem.minecraft.nether_wart|stat.useItem.minecraft.nether_wart_block|stat.useItem.minecraft.netherbrick|stat.useItem.minecraft.netherrack|stat.useItem.minecraft.noteblock|stat.useItem.minecraft.oak_stairs|stat.useItem.minecraft.obsidian|stat.useItem.minecraft.packed_ice|stat.useItem.minecraft.painting|stat.useItem.minecraft.paper|stat.useItem.minecraft.piston|stat.useItem.minecraft.planks|stat.useItem.minecraft.poisonous_potato|stat.useItem.minecraft.porkchop|stat.useItem.minecraft.potato|stat.useItem.minecraft.potion|stat.useItem.minecraft.prismarine|stat.useItem.minecraft.prismarine_crystals|stat.useItem.minecraft.prismarine_shard|stat.useItem.minecraft.pumpkin|stat.useItem.minecraft.pumpkin_pie|stat.useItem.minecraft.pumpkin_seeds|stat.useItem.minecraft.purpur_block|stat.useItem.minecraft.purpur_pillar|stat.useItem.minecraft.purpur_slab|stat.useItem.minecraft.purpur_stairs|stat.useItem.minecraft.quartz|stat.useItem.minecraft.quartz_block|stat.useItem.minecraft.quartz_ore|stat.useItem.minecraft.quartz_stairs|stat.useItem.minecraft.rabbit|stat.useItem.minecraft.rabbit_foot|stat.useItem.minecraft.rabbit_hide|stat.useItem.minecraft.rabbit_stew|stat.useItem.minecraft.rail|stat.useItem.minecraft.record_11|stat.useItem.minecraft.record_13|stat.useItem.minecraft.record_blocks|stat.useItem.minecraft.record_cat|stat.useItem.minecraft.record_chirp|stat.useItem.minecraft.record_far|stat.useItem.minecraft.record_mall|stat.useItem.minecraft.record_mellohi|stat.useItem.minecraft.record_stal|stat.useItem.minecraft.record_strad|stat.useItem.minecraft.record_wait|stat.useItem.minecraft.record_ward|stat.useItem.minecraft.red_flower|stat.useItem.minecraft.red_mushroom|stat.useItem.minecraft.red_mushroom_block|stat.useItem.minecraft.red_nether_brick|stat.useItem.minecraft.red_sandstone|stat.useItem.minecraft.red_sandstone_stairs|stat.useItem.minecraft.redstone|stat.useItem.minecraft.redstone_block|stat.useItem.minecraft.redstone_lamp|stat.useItem.minecraft.redstone_ore|stat.useItem.minecraft.redstone_torch|stat.useItem.minecraft.reeds|stat.useItem.minecraft.repeater|stat.useItem.minecraft.repeating_command_block|stat.useItem.minecraft.rotten_flesh|stat.useItem.minecraft.saddle|stat.useItem.minecraft.sand|stat.useItem.minecraft.sandstone|stat.useItem.minecraft.sandstone_stairs|stat.useItem.minecraft.sapling|stat.useItem.minecraft.sea_lantern|stat.useItem.minecraft.shears|stat.useItem.minecraft.shield|stat.useItem.minecraft.sign|stat.useItem.minecraft.skull|stat.useItem.minecraft.slime|stat.useItem.minecraft.slime_ball|stat.useItem.minecraft.snow|stat.useItem.minecraft.snow_layer|stat.useItem.minecraft.snowball|stat.useItem.minecraft.soul_sand|stat.useItem.minecraft.spawn_egg|stat.useItem.minecraft.speckled_melon|stat.useItem.minecraft.spectral_arrow|stat.useItem.minecraft.spider_eye|stat.useItem.minecraft.splash_potion|stat.useItem.minecraft.sponge|stat.useItem.minecraft.spruce_boat|stat.useItem.minecraft.spruce_door|stat.useItem.minecraft.spruce_fence|stat.useItem.minecraft.spruce_fence_gate|stat.useItem.minecraft.spruce_stairs|stat.useItem.minecraft.stained_glass|stat.useItem.minecraft.stained_glass_pane|stat.useItem.minecraft.stained_hardened_clay|stat.useItem.minecraft.stick|stat.useItem.minecraft.sticky_piston|stat.useItem.minecraft.stone|stat.useItem.minecraft.stone_axe|stat.useItem.minecraft.stone_brick_stairs|stat.useItem.minecraft.stone_button|stat.useItem.minecraft.stone_hoe|stat.useItem.minecraft.stone_pickaxe|stat.useItem.minecraft.stone_pressure_plate|stat.useItem.minecraft.stone_shovel|stat.useItem.minecraft.stone_slab|stat.useItem.minecraft.stone_slab2|stat.useItem.minecraft.stone_stairs|stat.useItem.minecraft.stone_sword|stat.useItem.minecraft.stonebrick|stat.useItem.minecraft.string|stat.useItem.minecraft.structure_block|stat.useItem.minecraft.structure_void|stat.useItem.minecraft.sugar|stat.useItem.minecraft.tallgrass|stat.useItem.minecraft.tipped_arrow|stat.useItem.minecraft.tnt|stat.useItem.minecraft.tnt_minecart|stat.useItem.minecraft.torch|stat.useItem.minecraft.trapdoor|stat.useItem.minecraft.trapped_chest|stat.useItem.minecraft.tripwire_hook|stat.useItem.minecraft.vine|stat.useItem.minecraft.water_bucket|stat.useItem.minecraft.waterlily|stat.useItem.minecraft.web|stat.useItem.minecraft.wheat|stat.useItem.minecraft.wheat_seeds|stat.useItem.minecraft.wooden_axe|stat.useItem.minecraft.wooden_button|stat.useItem.minecraft.wooden_door|stat.useItem.minecraft.wooden_hoe|stat.useItem.minecraft.wooden_pickaxe|stat.useItem.minecraft.wooden_pressure_plate|stat.useItem.minecraft.wooden_shovel|stat.useItem.minecraft.wooden_slab|stat.useItem.minecraft.wooden_sword|stat.useItem.minecraft.wool|stat.useItem.minecraft.writable_book|stat.useItem.minecraft.written_book|stat.useItem.minecraft.yellow_flower|stat.walkOneCm",
    "displaySlot": "*belowName|list|sidebar|sidebar.team.black|sidebar.team.dark_blue|sidebar.team.dark_green|sidebar.team.dark_aqua|sidebar.team.dark_red|sidebar.team.dark_purple|sidebar.team.gold|sidebar.team.gray|sidebar.team.dark_gray|sidebar.team.blue|sidebar.team.green|sidebar.team.aqua|sidebar.team.red|sidebar.team.light_purple|sidebar.team.yellow|sidebar.team.white",
    "effect": "*absorption|blindness|fire_resistance|glowing|haste|health_boost|hunger|instant_damage|instant_health|invisibility|jump_boost|levitation|luck|mining_fatigue|nausea|night_vision|poison|regeneration|resistance|saturation|slowness|speed|strength|unluck|water_breathing|weakness|wither",
    "enchantment": "*aqua_affinity|bane_of_arthropods|binding_curse|blast_protection|depth_strider|efficiency|feather_falling|fire_aspect|fire_protection|flame|fortune|frost_walker|infinity|knockback|looting|luck_of_the_sea|lure|mending|power|projectile_protection|protection|punch|respiration|sharpness|silk_touch|smite|sweeping|thorns|unbreaking|vanishing_curse",
    "entity": "*area_effect_cloud|armor_stand|arrow|bat|blaze|boat|cave_spider|chest_minecart|chicken|commandblock_minecart|cow|creeper|donkey|dragon_fireball|egg|elder_guardian|ender_crystal|ender_dragon|ender_pearl|enderman|endermite|evocation_fangs|evocation_illager|eye_of_ender_signal|falling_block|fireball|fireworks_rocket|furnace_minecart|ghast|giant|guardian|hopper_minecart|horse|husk|item|item_frame|leash_knot|lightning_bolt|llama|llama_spit|magma_cube|minecart|mooshroom|mule|ocelot|painting|pig|polar_bear|potion|rabbit|sheep|shulker|shulker_bullet|silverfish|skeleton|skeleton_horse|slime|small_fireball|snowball|snowman|spawner_minecart|spectral_arrow|spider|squid|stray|tnt|tnt_minecart|vex|villager|villager_golem|vindication_illager|witch|wither|wither_skeleton|wither_skull|wolf|xp_bottle|xp_orb|zombie|zombie_horse|zombie_pigman|zombie_villager",
    "item": "*acacia_boat|acacia_door|acacia_fence|acacia_fence_gate|acacia_stairs|activator_rail|air|anvil|apple|armor_stand|arrow|baked_potato|banner|barrier|beacon|bed|bedrock|beef|beetroot|beetroot_seeds|beetroot_soup|birch_boat|birch_door|birch_fence|birch_fence_gate|birch_stairs|black_shulker_box|blaze_powder|blaze_rod|blue_shulker_box|boat|bone|bone_block|book|bookshelf|bow|bowl|bread|brewing_stand|brick|brick_block|brick_stairs|brown_mushroom|brown_mushroom_block|brown_shulker_box|bucket|cactus|cake|carpet|carrot|carrot_on_a_stick|cauldron|chain_command_block|chainmail_boots|chainmail_chestplate|chainmail_helmet|chainmail_leggings|chest|chest_minecart|chicken|chorus_flower|chorus_fruit|chorus_fruit_popped|chorus_plant|clay|clay_ball|clock|coal|coal_block|coal_ore|cobblestone|cobblestone_wall|command_block|command_block_minecart|comparator|compass|cooked_beef|cooked_chicken|cooked_fish|cooked_mutton|cooked_porkchop|cooked_rabbit|cookie|crafting_table|cyan_shulker_box|dark_oak_boat|dark_oak_door|dark_oak_fence|dark_oak_fence_gate|dark_oak_stairs|daylight_detector|deadbush|detector_rail|diamond|diamond_axe|diamond_block|diamond_boots|diamond_chestplate|diamond_helmet|diamond_hoe|diamond_horse_armor|diamond_leggings|diamond_ore|diamond_pickaxe|diamond_shovel|diamond_sword|dirt|dispenser|double_plant|dragon_breath|dragon_egg|dropper|dye|egg|elytra|emerald|emerald_block|emerald_ore|enchanted_book|enchanting_table|end_bricks|end_crystal|end_portal_frame|end_rod|end_stone|ender_chest|ender_eye|ender_pearl|experience_bottle|farmland|feather|fence|fence_gate|fermented_spider_eye|filled_map|fire_charge|firework_charge|fireworks|fish|fishing_rod|flint|flint_and_steel|flower_pot|furnace|furnace_minecart|ghast_tear|glass|glass_bottle|glass_pane|glowstone|glowstone_dust|gold_block|gold_ingot|gold_nugget|gold_ore|golden_apple|golden_axe|golden_boots|golden_carrot|golden_chestplate|golden_helmet|golden_hoe|golden_horse_armor|golden_leggings|golden_pickaxe|golden_rail|golden_shovel|golden_sword|grass|grass_path|gravel|gray_shulker_box|green_shulker_box|gunpowder|hardened_clay|hay_block|heavy_weighted_pressure_plate|hopper|hopper_minecart|ice|iron_axe|iron_bars|iron_block|iron_boots|iron_chestplate|iron_door|iron_helmet|iron_hoe|iron_horse_armor|iron_ingot|iron_leggings|iron_nugget|iron_ore|iron_pickaxe|iron_shovel|iron_sword|iron_trapdoor|item_frame|jukebox|jungle_boat|jungle_door|jungle_fence|jungle_fence_gate|jungle_stairs|ladder|lapis_block|lapis_ore|lava_bucket|lead|leather|leather_boots|leather_chestplate|leather_helmet|leather_leggings|leaves|leaves2|lever|light_blue_shulker_box|light_weighted_pressure_plate|lime_shulker_box|lingering_potion|lit_pumpkin|log|log2|magenta_shulker_box|magma|magma_cream|map|melon|melon_block|melon_seeds|milk_bucket|minecart|mob_spawner|monster_egg|mossy_cobblestone|mushroom_stew|mutton|mycelium|name_tag|nether_brick|nether_brick_fence|nether_brick_stairs|nether_star|nether_wart|nether_wart_block|netherbrick|netherrack|noteblock|oak_stairs|observer|obsidian|orange_shulker_box|packed_ice|painting|paper|pink_shulker_box|piston|planks|poisonous_potato|porkchop|potato|potion|prismarine|prismarine_crystals|prismarine_shard|pumpkin|pumpkin_pie|pumpkin_seeds|purple_shulker_box|purpur_block|purpur_pillar|purpur_slab|purpur_stairs|quartz|quartz_block|quartz_ore|quartz_stairs|rabbit|rabbit_foot|rabbit_hide|rabbit_stew|rail|record_11|record_13|record_blocks|record_cat|record_chirp|record_far|record_mall|record_mellohi|record_stal|record_strad|record_wait|record_ward|red_flower|red_mushroom|red_mushroom_block|red_nether_brick|red_sandstone|red_sandstone_stairs|red_shulker_box|redstone|redstone_block|redstone_lamp|redstone_ore|redstone_torch|reeds|repeater|repeating_command_block|rotten_flesh|saddle|sand|sandstone|sandstone_stairs|sapling|sea_lantern|shears|shield|shulker_shell|sign|silver_shulker_box|skull|slime|slime_ball|snow|snow_layer|snowball|soul_sand|spawn_egg|speckled_melon|spectral_arrow|spider_eye|splash_potion|sponge|spruce_boat|spruce_door|spruce_fence|spruce_fence_gate|spruce_stairs|stained_glass|stained_glass_pane|stained_hardened_clay|stick|sticky_piston|stone|stone_axe|stone_brick_stairs|stone_button|stone_hoe|stone_pickaxe|stone_pressure_plate|stone_shovel|stone_slab|stone_slab2|stone_stairs|stone_sword|stonebrick|string|structure_block|structure_void|sugar|tallgrass|tipped_arrow|tnt|tnt_minecart|torch|totem_of_undying|trapdoor|trapped_chest|tripwire_hook|vine|water_bucket|waterlily|web|wheat|wheat_seeds|white_shulker_box|wooden_axe|wooden_button|wooden_door|wooden_hoe|wooden_pickaxe|wooden_pressure_plate|wooden_shovel|wooden_slab|wooden_sword|wool|writable_book|written_book|yellow_flower|yellow_shulker_box",
    "gamemode": "*adventure|creative|spectator|survival",
    "particle": "*angryVillager|barrier|blockcrack|blockdust|bubble|cloud|crit|damageIndicator|depthsuspend|dragonbreath|dripLava|dripWater|droplet|enchantmenttable|endRod|explode|fallingdust|fireworksSpark|flame|footstep|happyVillager|heart|hugeexplosion|iconcrack|instantSpell|largeexplode|largesmoke|lava|magicCrit|mobSpell|mobSpellAmbient|mobappearance|note|portal|reddust|slime|smoke|snowballpoof|snowshovel|spell|spit|splash|suspended|sweepAttack|take|totem|townaura|wake|witchMagic",
    "player": "*@a|@p|@r",
    "selector": "*@a|@e|@p|@r",
    "slot": "*slot_number|slot.armor.chest|slot.armor.feet|slot.armor.head|slot.armor.legs|slot.weapon.mainhand|slot.weapon.offhand|slot.enderchest.slot_number|slot.hotbar.slot_number|slot.inventory.slot_number|slot.horse.saddle|slot.horse.armor|slot.horse.chest|slot.villager.slot_number",
    "sound": "*ambient.cave|block.anvil.break|block.anvil.destroy|block.anvil.fall|block.anvil.hit|block.anvil.land|block.anvil.place|block.anvil.step|block.anvil.use|block.brewing_stand.brew|block.chest.close|block.chest.locked|block.chest.open|block.chorus_flower.death|block.chorus_flower.grow|block.cloth.break|block.cloth.fall|block.cloth.hit|block.cloth.place|block.cloth.step|block.comparator.click|block.dispenser.dispense|block.dispenser.fail|block.dispenser.launch|block.enchantment_table.use|block.end_gateway.spawn|block.enderchest.close|block.enderchest.open|block.fence_gate.close|block.fence_gate.open|block.fire.ambient|block.fire.extinguish|block.furnace.fire_crackle|block.glass.break|block.glass.fall|block.glass.hit|block.glass.place|block.glass.step|block.grass.break|block.grass.fall|block.grass.hit|block.grass.place|block.grass.step|block.gravel.break|block.gravel.fall|block.gravel.hit|block.gravel.place|block.gravel.step|block.iron_door.close|block.iron_door.open|block.iron_trapdoor.close|block.iron_trapdoor.open|block.ladder.break|block.ladder.fall|block.ladder.hit|block.ladder.place|block.ladder.step|block.lava.ambient|block.lava.extinguish|block.lava.pop|block.lever.click|block.metal.break|block.metal.fall|block.metal.hit|block.metal.place|block.metal.step|block.metal_pressureplate.click_off|block.metal_pressureplate.click_on|block.note.basedrum|block.note.bass|block.note.harp|block.note.hat|block.note.pling|block.note.snare|block.piston.contract|block.piston.extend|block.portal.ambient|block.portal.travel|block.portal.trigger|block.redstone_torch.burnout|block.sand.break|block.sand.fall|block.sand.hit|block.sand.place|block.sand.step|block.slime.break|block.slime.fall|block.slime.hit|block.slime.place|block.slime.step|block.snow.break|block.snow.fall|block.snow.hit|block.snow.place|block.snow.step|block.stone.break|block.stone.fall|block.stone.hit|block.stone.place|block.stone.step|block.stone_button.click_off|block.stone_button.click_on|block.stone_pressureplate.click_off|block.stone_pressureplate.click_on|block.tripwire.attach|block.tripwire.click_off|block.tripwire.click_on|block.tripwire.detach|block.water.ambient|block.waterlily.place|block.wood.break|block.wood.fall|block.wood.hit|block.wood.place|block.wood.step|block.wood_button.click_off|block.wood_button.click_on|block.wood_pressureplate.click_off|block.wood_pressureplate.click_on|block.wooden_door.close|block.wooden_door.open|block.wooden_trapdoor.close|block.wooden_trapdoor.open|enchant.thorns.hit|entity.armorstand.break|entity.armorstand.fall|entity.armorstand.hit|entity.armorstand.place|entity.arrow.hit|entity.arrow.hit_player|entity.arrow.shoot|entity.bat.ambient|entity.bat.death|entity.bat.hurt|entity.bat.loop|entity.bat.takeoff|entity.blaze.ambient|entity.blaze.burn|entity.blaze.death|entity.blaze.hurt|entity.blaze.shoot|entity.bobber.splash|entity.bobber.throw|entity.cat.ambient|entity.cat.death|entity.cat.hiss|entity.cat.hurt|entity.cat.purr|entity.cat.purreow|entity.chicken.ambient|entity.chicken.death|entity.chicken.egg|entity.chicken.hurt|entity.chicken.step|entity.cow.ambient|entity.cow.death|entity.cow.hurt|entity.cow.milk|entity.cow.step|entity.creeper.death|entity.creeper.hurt|entity.creeper.primed|entity.donkey.ambient|entity.donkey.angry|entity.donkey.chest|entity.donkey.death|entity.donkey.hurt|entity.egg.throw|entity.elder_guardian.ambient|entity.elder_guardian.ambient_land|entity.elder_guardian.curse|entity.elder_guardian.death|entity.elder_guardian.death_land|entity.elder_guardian.hurt|entity.elder_guardian.hurt_land|entity.enderdragon.ambient|entity.enderdragon.death|entity.enderdragon.flap|entity.enderdragon.growl|entity.enderdragon.hurt|entity.enderdragon.shoot|entity.enderdragon_fireball.explode|entity.endereye.launch|entity.endermen.ambient|entity.endermen.death|entity.endermen.hurt|entity.endermen.scream|entity.endermen.stare|entity.endermen.teleport|entity.endermite.ambient|entity.endermite.death|entity.endermite.hurt|entity.endermite.step|entity.enderpearl.throw|entity.experience_bottle.throw|entity.experience_orb.pickup|entity.experience_orb.touch|entity.firework.blast|entity.firework.blast_far|entity.firework.large_blast|entity.firework.large_blast_far|entity.firework.launch|entity.firework.shoot|entity.firework.twinkle|entity.firework.twinkle_far|entity.generic.big_fall|entity.generic.burn|entity.generic.death|entity.generic.drink|entity.generic.eat|entity.generic.explode|entity.generic.extinguish_fire|entity.generic.hurt|entity.generic.small_fall|entity.generic.splash|entity.generic.swim|entity.ghast.ambient|entity.ghast.death|entity.ghast.hurt|entity.ghast.scream|entity.ghast.shoot|entity.ghast.warn|entity.guardian.ambient|entity.guardian.ambient_land|entity.guardian.attack|entity.guardian.death|entity.guardian.death_land|entity.guardian.flop|entity.guardian.hurt|entity.guardian.hurt_land|entity.horse.ambient|entity.horse.angry|entity.horse.armor|entity.horse.breathe|entity.horse.death|entity.horse.eat|entity.horse.gallop|entity.horse.hurt|entity.horse.jump|entity.horse.land|entity.horse.saddle|entity.horse.step|entity.horse.step_wood|entity.hostile.big_fall|entity.hostile.death|entity.hostile.hurt|entity.hostile.small_fall|entity.hostile.splash|entity.hostile.swim|entity.husk.ambient|entity.husk.death|entity.husk.hurt|entity.husk.step|entity.irongolem.attack|entity.irongolem.death|entity.irongolem.hurt|entity.irongolem.step|entity.item.break|entity.item.pickup|entity.itemframe.add_item|entity.itemframe.break|entity.itemframe.place|entity.itemframe.remove_item|entity.itemframe.rotate_item|entity.leashknot.break|entity.leashknot.place|entity.lightning.impact|entity.lightning.thunder|entity.lingeringpotion.throw|entity.magmacube.death|entity.magmacube.hurt|entity.magmacube.jump|entity.magmacube.squish|entity.minecart.inside|entity.minecart.riding|entity.mooshroom.shear|entity.mule.ambient|entity.mule.death|entity.mule.hurt|entity.painting.break|entity.painting.place|entity.pig.ambient|entity.pig.death|entity.pig.hurt|entity.pig.saddle|entity.pig.step|entity.player.attack.crit|entity.player.attack.knockback|entity.player.attack.nodamage|entity.player.attack.strong|entity.player.attack.sweep|entity.player.attack.weak|entity.player.big_fall|entity.player.breath|entity.player.burp|entity.player.death|entity.player.hurt|entity.player.levelup|entity.player.small_fall|entity.player.splash|entity.player.swim|entity.polar_bear.ambient|entity.polar_bear.baby_ambient|entity.polar_bear.death|entity.polar_bear.hurt|entity.polar_bear.step|entity.polar_bear.warning|entity.rabbit.ambient|entity.rabbit.attack|entity.rabbit.death|entity.rabbit.hurt|entity.rabbit.jump|entity.sheep.ambient|entity.sheep.death|entity.sheep.hurt|entity.sheep.shear|entity.sheep.step|entity.shulker.ambient|entity.shulker.close|entity.shulker.death|entity.shulker.hurt|entity.shulker.hurt_closed|entity.shulker.open|entity.shulker.shoot|entity.shulker.teleport|entity.shulker_bullet.hit|entity.shulker_bullet.hurt|entity.silverfish.ambient|entity.silverfish.death|entity.silverfish.hurt|entity.silverfish.step|entity.skeleton.ambient|entity.skeleton.death|entity.skeleton.hurt|entity.skeleton.shoot|entity.skeleton.step|entity.skeleton_horse.ambient|entity.skeleton_horse.death|entity.skeleton_horse.hurt|entity.slime.attack|entity.slime.death|entity.slime.hurt|entity.slime.jump|entity.slime.squish|entity.small_magmacube.death|entity.small_magmacube.hurt|entity.small_magmacube.squish|entity.small_slime.death|entity.small_slime.hurt|entity.small_slime.jump|entity.small_slime.squish|entity.snowball.throw|entity.snowman.ambient|entity.snowman.death|entity.snowman.hurt|entity.snowman.shoot|entity.spider.ambient|entity.spider.death|entity.spider.hurt|entity.spider.step|entity.splash_potion.break|entity.splash_potion.throw|entity.squid.ambient|entity.squid.death|entity.squid.hurt|entity.stray.ambient|entity.stray.death|entity.stray.hurt|entity.stray.step|entity.tnt.primed|entity.villager.ambient|entity.villager.death|entity.villager.hurt|entity.villager.no|entity.villager.trading|entity.villager.yes|entity.witch.ambient|entity.witch.death|entity.witch.drink|entity.witch.hurt|entity.witch.throw|entity.wither.ambient|entity.wither.break_block|entity.wither.death|entity.wither.hurt|entity.wither.shoot|entity.wither.spawn|entity.wither_skeleton.ambient|entity.wither_skeleton.death|entity.wither_skeleton.hurt|entity.wither_skeleton.step|entity.wolf.ambient|entity.wolf.death|entity.wolf.growl|entity.wolf.howl|entity.wolf.hurt|entity.wolf.pant|entity.wolf.shake|entity.wolf.step|entity.wolf.whine|entity.zombie.ambient|entity.zombie.attack_door_wood|entity.zombie.attack_iron_door|entity.zombie.break_door_wood|entity.zombie.death|entity.zombie.hurt|entity.zombie.infect|entity.zombie.step|entity.zombie_horse.ambient|entity.zombie_horse.death|entity.zombie_horse.hurt|entity.zombie_pig.ambient|entity.zombie_pig.angry|entity.zombie_pig.death|entity.zombie_pig.hurt|entity.zombie_villager.ambient|entity.zombie_villager.converted|entity.zombie_villager.cure|entity.zombie_villager.death|entity.zombie_villager.hurt|entity.zombie_villager.step|item.armor.equip_chain|item.armor.equip_diamond|item.armor.equip_generic|item.armor.equip_gold|item.armor.equip_iron|item.armor.equip_leather|item.bottle.fill|item.bottle.fill_dragonbreath|item.bucket.empty|item.bucket.empty_lava|item.bucket.fill|item.bucket.fill_lava|item.chorus_fruit.teleport|item.elytra.flying|item.firecharge.use|item.flintandsteel.use|item.hoe.till|item.shield.block|item.shield.break|item.shovel.flatten|music.creative|music.credits|music.dragon|music.end|music.game|music.menu|music.nether|record.11|record.13|record.blocks|record.cat|record.chirp|record.far|record.mall|record.mellohi|record.stal|record.strad|record.wait|record.ward|ui.button.click|weather.rain|weather.rain.above",
    "soundSource": "*master|music|record|weather|block|hostile|neutral|player|ambient|voice",
    "stat": "*AffectedBlocks|AffectedEntities|AffectedItems|QueryResult|SuccessCount"
  };

  function textMatch( str1, str2 ) {
    return str2.indexOf( str1 ) === 0;
  }

  function textEq( str1, str2 ) {
    if( str2[0] === "*" ) {
      var strings = str2.substr( 1 ).split( "|" ),
        i = strings.length;
      while( i-- ) {
        if( textEq( strings[i], str1 ) ) return true;
      }
      return false;
    }
    else {
      return str1 === str2;
    }
  }

  function getHints( cm ) {
    var cur = cm.getCursor(),
      fullLine = cm.getLine( cur.line );

    var list = [];

    function pushHint( hint ) {
      list.push( {
        text: hint,
        displayText: hint
      } );
    }

    function explorePartsCollection( itemPos, partsCollection ) {
      var currentItem = items[itemPos],
        isLastItem = itemPos + 1 >= items.length,
        firstPart;

      partsCollection.forEach( function( parts ) {
        firstPart = parts[0];
        if( isLastItem || textEq( currentItem, firstPart ) || firstPart[0] === "#" ) {
          exploreParts( itemPos, parts, 0 );
        }
      } );
    }

    function exploreParts( itemPos, parts, partPos ) {
      var currentItem = items[itemPos],
        isLastItem = itemPos + 1 >= items.length,
        currentPart = parts[partPos];

      if( typeof currentPart === "string" && currentPart[0] === "#" ) {
        currentPart = dictionnary[ currentPart.substr( 1 ) ];
      }

      if( typeof currentPart === "object" ) {
        explorePartsCollection( itemPos, currentPart );
      }

      else if( typeof currentPart === "string" ) {

        if( isLastItem ) {
          if( currentPart[0] === "*" ) {
            var currentParts = currentPart.substr( 1 ).split( "|" );
            currentParts.forEach( function( currentPart ) {
              if( textMatch( currentItem, currentPart ) ) pushHint( currentPart );
            } );
          }
          else {
            if( textMatch( currentItem, currentPart ) ) {
              pushHint( currentPart );
            }
          }
        }

        else {
          exploreParts( itemPos + 1, parts, partPos + 1 );
        }

      }
    }

    var line = fullLine.substr( 0, cur.ch ),
      ignore = line.match( /^\s*(?:[irc01!\?]+:)?\/?/ );

    line = line.substr( ignore[0].length );
    var items = line.split( /\s+/ );

    explorePartsCollection( 0, dictionnary["command"] );

    var lastItem = line.match( /\S*$/ );

    return {
      list: list,
      from: Pos( cur.line, lastItem.index + ignore[0].length ),
      to: Pos( cur.line, lastItem.index + lastItem[0].length + ignore[0].length )
    };
  }

  CodeMirror.registerHelper( "hint", "commander", getHints );
} );
