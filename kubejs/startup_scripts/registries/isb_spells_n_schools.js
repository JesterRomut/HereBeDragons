StartupEvents.registry("attribute", (event) => {
    // Use the `spell` type for these attributes and set all the values needed. The default value has to be higher than the minimum value and lower than the maximum value.
    event
        .create("dragon_spell_power", "spell")
        .range(1.0, 0, 10)
        .attachToPlayers();
    event
        .create("dragon_magic_resistance", "spell")
        .range(1.0, 0, 10)
        .attachToPlayers();
});

// EntityJSEvents.attributes((event) => {
//     event.allTypes.forEach((type) => {
//         event.modify(type, (a) => {
//             a.add("kubejs:dragon_spell_power");
//             a.add("kubejs:dragon_spell_resistance");
//         });
//     });
// });

StartupEvents.registry("irons_spellbooks:schools", (event) => {
    event
        .create("dragon")
        .setName(
            Text.of({ translate: "school.kubejs.dragon" }).color("#967CA6")
        )
        .setPowerAttribute("kubejs:dragon_spell_power")
        .setResistanceAttribute("kubejs:dragon_magic_resistance")
        .setDefaultCastSound("irons_spellbooks:cast.generic.holy")
        .setDamageType("minecraft:dragon_breath")
        .disableLooting();
});

StartupEvents.registry("irons_spellbooks:spells", (event) => {
    event
        .create("taotie_fabel")
        .setCastTime(10)
        .setBaseManaCost(2)
        // .setCooldownSeconds(0) // Spell cooldown in seconds
        .setManaCostPerLevel(10) // How much additional mana is needed per level
        .setCastType("instant") // Cast type can be "continuous", "long", "instant", or "none"
        .setSchool("kubejs:dragon") // The school type. This is the ID of the school you want to use
        // .setMinRarity("common") // The minimum rarity of the spell. Can be "common", "uncommon", "rare", "epic", or "legendary"
        .setStartSound("item.honey_bottle.drink") // The sound to be played when you start casting the spell. Used for long spells
        .setFinishSound("item.honey_bottle.drink") // Plays when the spell has finished casting
        // .onCast((ctx) => {
        //     global.DRAGON_MAGIC.taotieFabel_casted(ctx);
        // })
        .setAllowLooting(false) // Setting this to false will disallow looting the spell from mobs or chests
        .needsLearning(false) // Usually this one is used for Eldritch spells
        .canBeCraftedBy((player) => {
            return global.UTILS.isDragon(player);
        })
        .setUniqueInfo((spellLevel, caster) => {
            let growth = -1;
            if (caster) {
                if (caster.isPlayer()) {
                    growth = global.UTILS.dragonGrowth(caster);
                }
            }

            let maxSpace =
                growth == -1 ? 1 : (Math.pow(spellLevel, 1.5) * growth) / 10;
            // Caster refers to the player
            return [
                // You need to return an array of components for this method. They can be any text you want.
                Text.translate("kubejs.spell.taotie_fabel.uniqueinfo.1", [
                    spellLevel * 4,
                ]),
                Text.translate("kubejs.spell.taotie_fabel.uniqueinfo.2", [
                    spellLevel >= 10 ? "∞" : maxSpace.toFixed(1),
                    (growth / 10).toFixed(1),
                ]),
            ];
        });

    event
        .create("ananta_remanta")
        .setCastTime(120)
        .setBaseManaCost(2)
        // .setCooldownSeconds(15) // Spell cooldown in seconds
        .setManaCostPerLevel(2) // How much additional mana is needed per level
        .setCastType("continuous") // Cast type can be "continuous", "long", "instant", or "none"
        .setSchool("kubejs:dragon") // The school type. This is the ID of the school you want to use
        // .setMinRarity("common") // The minimum rarity of the spell. Can be "common", "uncommon", "rare", "epic", or "legendary"
        .setStartSound("irons_spellbooks:cast.generic.holy") // The sound to be played when you start casting the spell. Used for long spells
        .setFinishSound("irons_spellbooks:cast.generic.holy") // Plays when the spell has finished casting
        // .onCast((ctx) => {
        //     global.DRAGON_MAGIC.taotieFabel_casted(ctx);
        // })
        .setAllowLooting(false) // Setting this to false will disallow looting the spell from mobs or chests
        .needsLearning(false) // Usually this one is used for Eldritch spells
        .canBeCraftedBy((player) => {
            return global.UTILS.isDragon(player);
        })
        .setUniqueInfo((spellLevel, caster) => {
            try {
                let { captureHealth, failureRate, growth } =
                    global.DRAGON_MAGIC.anantaRemanta_info(spellLevel, caster);
                return [
                    // You need to return an array of components for this method. They can be any text you want.
                    Text.translatable(
                        "kubejs.spell.ananta_remanta.uniqueinfo.1",
                        captureHealth.toFixed(1),
                        (growth / 10).toFixed(1)
                    ),
                    Text.translate("kubejs.spell.ananta_remanta.uniqueinfo.2", [
                        failureRate.toFixed(1),
                        (growth / 10).toFixed(1),
                    ]),
                ];
            } catch (e) {
                console.log(e);
                return [];
            }
            //global.DRAGON_MAGIC.anantaRemantaInfo(spellLevel, caster)
        });
});
