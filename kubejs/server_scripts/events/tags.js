ServerEvents.tags("item", (event) => {
    event.add("kubejs:dragon_focus", [
        "dragonsurvival:weak_dragon_heart",
        "dragonsurvival:elder_dragon_heart",
    ]);

    event.add("kubejs:dragon_flags", [
        "kubejs:dragon_flag",
        "kubejs:endless_myth_flag",
        "kubejs:endless_undead_flag",
        "kubejs:endless_titan_flag",
        "kubejs:endless_dragon_flag",
    ]);

    event.add("kubejs:dragon_reproduction_item", [
        "iceandfire:lightning_lily",
        "iceandfire:frost_lily",
        "iceandfire:fire_lily",
        "iceandfire:lightning_stew",
        "iceandfire:frost_stew",
        "iceandfire:fire_stew",
    ]);

    event.add("kubejs:dragon_eggs", [
        "iceandfire:dragonegg_amethyst",
        "iceandfire:dragonegg_black",
        "iceandfire:dragonegg_blue",
        "iceandfire:dragonegg_bronze",
        "iceandfire:dragonegg_copper",
        "iceandfire:dragonegg_electric",
        "iceandfire:dragonegg_gray",
        "iceandfire:dragonegg_green",
        "iceandfire:dragonegg_red",
        "iceandfire:dragonegg_sapphire",
        "iceandfire:dragonegg_silver",
        "iceandfire:dragonegg_white",
    ]);

    event.add("kubejs:dragon_taming_items", [
        "iceandfire:dragon_stick",
        "iceandfire:dragon_flute",
        "iceandfire:dragon_horn",
    ]);

    event.add("kubejs:dragon_summoning_crystals", [
        "iceandfire:summoning_crystal_fire",
        "iceandfire:summoning_crystal_ice",
        "iceandfire:summoning_crystal_lightning",
    ]);

    event.add("kubejs:dragon_flesh", [
        "iceandfire:fire_dragon_flesh",
        "iceandfire:ice_dragon_flesh",
        "iceandfire:lightning_dragon_flesh",
    ]);

    event.add("kubejs:newgen_dragon_hearts", [
        "iceandfire:fire_dragon_heart",
        "iceandfire:ice_dragon_heart",
        "iceandfire:lightning_dragon_heart",
    ]);

    event.add("kubejs:items_with_breed_data", [
        "#kubejs:dragon_eggs",
        "iceandfire:dragon_horn",
        "kubejs:gene_holder",
        "kubejs:gene_splicer",
        "kubejs:gene_caster",
    ]);

    event.add("kubejs:holdable_skulls", [
        "#minecraft:skulls",
        "#c:skulls",
        "#iceandfire:mob_skulls",
        "#iceandfire:dragon_skulls",
    ]);

    event.add("kubejs:gene_viewer", [
        "kubejs:gene_seeker",
        "kubejs:gene_splicer",
        "kubejs:gene_caster",
    ]);

    event.add("kubejs:gene_imbueable", [
        "kubejs:gene_splicer",
        "kubejs:gene_caster",
    ]);

    // event.add("kubejs:fire_dragon_related_stuff")
});
