let $ChunkPos = Java.loadClass("net.minecraft.world.level.ChunkPos");
let $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");

function conquerStatus(minX, maxX, minY, maxY, minZ, maxZ) {
    let result = new $CompoundTag();

    result.putInt("minX", minX);
    result.putInt("maxX", maxX);
    result.putInt("minY", minY);
    result.putInt("maxY", maxY);
    result.putInt("minZ", minZ);
    result.putInt("maxZ", maxZ);

    return result;
}

function addDragonConquerRecord(
    player,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    structure_id
) {
    addDragonConquerRecord_withConquerStatus(
        player,
        conquerStatus(minX, maxX, minY, maxY, minZ, maxZ),
        structure_id
    );
}

function addDragonConquerRecord_withConquerStatus(
    player,
    conquerStatus,
    structure_id
) {
    let { dragonConquerRecords } = player.persistentData;

    //console.log(dragonConquerRecords);

    //let recordsOfSameTypeStructure = dragonConquerRecords.get(structure_id)

    if (!dragonConquerRecords || dragonConquerRecords.isEmpty()) {
        player.persistentData.dragonConquerRecords = new $CompoundTag();
        player.persistentData.dragonConquerRecords[structure_id] = [];
        //console.log(111);
    }

    //console.log(player.persistentData.dragonConquerRecords[structure_id]);

    if (!player.persistentData.dragonConquerRecords[structure_id]) {
        player.persistentData.dragonConquerRecords[structure_id] = [];
        console.log(player.persistentData.dragonConquerRecords[structure_id]);
    }
    //console.log(111);
    player.persistentData.dragonConquerRecords[structure_id].push(
        conquerStatus
    );
    //console.log(111);
}

/**
 *
 * @param {$ServerPlayer_} player
 * @returns
 */
function failDragonConquest(player) {
    clearDragonConquerCurrent(player);
}

/**
 *
 * @param {$ServerPlayer_} player
 * @returns
 */
function finishDragonConquest(player) {
    let { dragonConquerCurrent } = player.persistentData;
    const { STRUCTURE_DATA } = global;
    //console.log(111);

    if (dragonConquerCurrent == undefined) return;
    //console.log(111);

    let currentId = player.persistentData.getString("dragonConquerCurrentId");
    if (currentId == undefined) return;
    //console.log(111);

    // console.log(STRUCTURE_DATA[currentId].gateway);

    // player.give(
    //     `kubejs:dragon_conquest_trophy[custom_data={gateway=${STRUCTURE_DATA[currentId].gateway}}]`
    // );

    // player.addItem(
    //     `kubejs:dragon_conquest_trophy[custom_data={gateway=${STRUCTURE_DATA[currentId].gateway}}]`
    // );

    addDragonConquerRecord_withConquerStatus(
        player,
        dragonConquerCurrent,
        currentId
    );
    clearDragonConquerCurrent(player);

    player.tell(Text.translate("kubejs.conquest.success").color(textColor));

    if (player.hasEffect("dragonsurvival:hunter_omen")) {
        player.removeEffect("dragonsurvival:hunter_omen");
    }
    // const trophy = Item.of("kubejs:dragon_conquest_trophy")
    // trophy.setCustomData("structure_id", structure_id)
    player.give(
        Item.of(
            `kubejs:dragon_conquest_trophy[custom_data={gateway:"${STRUCTURE_DATA[
                currentId
            ].gateway.replace("kubejs:", "")}"}]`
        )
    );
}

// function givesTrophyIfFirstTime(server, player, structure_id) {
//     const { dragonConquerRecords } = player.persistentData;
//     if (!(dragonConquerRecords instanceof $OrderedCompoundTag)) return;
//     // let tag = dragonConquerRecords.get(structure_id)
//     // if (tag instanceof $ListTag) {
//     //     tag.isEmpty()
//     // }
//     //console.log(dragonConquerRecords[structure_id])
//     if (!dragonConquerRecords[structure_id].isEmpty()) return;

//     //server.runCommand(`/give ${player.name.toString()} kubejs:dragon_conquest_trophy[minecraft:custom_data={structure_id:${structure_id}}]`)

// }

// /**
//  *
//  * @param {Internal.Entity} entity
//  * @param {String} structure
//  * @returns
//  */
// function isInStructure(entity, structure) {
//     let pos = entity.block.pos
//     let dimension = entity.getLevel().dimensionKey;
//     let sw = entity.server["getLevel(net.minecraft.resources.ResourceKey)"](dimension)
//     if (sw instanceof ServerLevel) {
//         let chunk = sw.getChunk(pos.x >> 4, pos.z >> 4, ChunkStatus.STRUCTURE_REFERENCES, false);
//         if (chunk == null) {
//             return false;
//         }
//         let references = chunk.getAllReferences();
//         for (references of references.entrySet()) {
//             let e = references
//             let longs = e.getValue();
//             if (!longs.isEmpty()) {
//                 let struct = e.getKey();
//                 let key = sw.registryAccess().registryOrThrow(Registries.STRUCTURE).getKey(struct);

//                 if (key.toString() == structure) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//         }
//     }
//     return false;

// }

/**
 *
 * @param {$BlockPlacedKubeEvent_} event
 * @returns
 */
function blockPlaced_dragonConquer(event) {
    let { player } = event;

    if (!player) return;

    const { STRUCTURE_DATA } = global;

    if (event.block.id == "kubejs:dragon_flag") {
        // 放置龙旗基座时的提示
        //let level = event.getLevel()

        let { structure, structure_id } = whichStructureAmI(
            player.blockPosition(),
            event.getLevel()
        );

        if (structure_id == "") {
            //没有结构
            player.tell(
                Text.translate("kubejs.conquest.no_structure").color(textColor)
            );
            return;
        }

        let targetGateway = STRUCTURE_DATA[structure_id];

        if (!targetGateway) {
            player.tell(
                Text.translate("kubejs.conquest.structure_not_available").color(
                    textColor
                )
            );
            return;
        }

        //检测当前占领

        if (event.player.persistentData.dragonConquerCurrent != undefined) {
            player.tell(
                Text.translate("kubejs.conquest.has_current_conquest").color(
                    textColor
                )
            );
            return;
        }

        //dragonConquerRecords = new $OrderedCompoundTag()

        let bbox = structure.getBoundingBox();
        // 检测已占领
        if (
            matchDragonConquerRecord(
                player,
                bbox.minX(),
                bbox.maxX(),
                bbox.minY(),
                bbox.maxY(),
                bbox.minZ(),
                bbox.maxZ(),
                structure_id
            )
        ) {
            //block.set("kubejs:dragon_flag_active")
            player.tell(
                Text.translate(
                    "kubejs.conquest.conquest_already_completed"
                ).color(textColor)
            );
            return;
        }

        player.tell(
            Text.translatable("kubejs.conquest.info.structure", [
                Text.translate(STRUCTURE_DATA[structure_id].name).gold(),
            ]).color(textColor)
        );
        player.tell(
            Text.translate(STRUCTURE_DATA[structure_id].description).color(
                textColor
            )
        );
        player.tell(
            Text.translate("kubejs.conquest.info.ask").color(textColor)
        );

        return;
    }

    if (!event.block.hasTag("minecraft:banners")) return;

    let { block } = placedAgainstMap[player.uuid];
    //if (!(block instanceof $BlockContainerJS)) return;
    if (block.id != "kubejs:dragon_flag") return;

    // 龙旗激活
    //let level = event.getLevel()

    // let currentStructure;
    // let structure_id = "";
    // level.structureManager().startsForStructure($ChunkPos(player.blockPosition()), ()=>true).stream().forEach(ss => {
    //     if (ss.getBoundingBox().isInside(player.blockPosition())) {
    //         structure_id = Registry.of("worldgen/structure").getKey(ss.getStructure()).location()
    //         currentStructure = ss;
    //         return;
    //     }
    // })
    let { structure, structure_id } = whichStructureAmI(
        player.blockPosition(),
        event.getLevel()
    );

    if (structure_id == "") {
        //没有结构
        player.tell(
            Text.translate("kubejs.conquest.no_structure").color(textColor)
        );
        return;
    }

    let targetGateway = STRUCTURE_DATA[structure_id].gateway;

    if (!targetGateway) {
        player.tell(
            Text.translate("kubejs.conquest.structure_not_available").color(
                textColor
            )
        );
        return;
    }

    // STRUCTURE_DATA.forEach((data, structure) => {
    //     if (structure_id == structure) {
    //         targetGateway = data.gateway;
    //         return;
    //     }

    // })

    //检测当前占领

    if (event.player.persistentData.dragonConquerCurrent != undefined) {
        player.tell(
            Text.translate("kubejs.conquest.has_current_conquest").color(
                textColor
            )
        );
        return;
    }

    //dragonConquerRecords = new $OrderedCompoundTag()

    let bbox = structure.getBoundingBox();
    // 检测已占领
    if (
        matchDragonConquerRecord(
            player,
            bbox.minX(),
            bbox.maxX(),
            bbox.minY(),
            bbox.maxY(),
            bbox.minZ(),
            bbox.maxZ(),
            structure_id
        )
    ) {
        //block.set("kubejs:dragon_flag_active")
        player.tell(
            Text.translate("kubejs.conquest.conquest_already_completed").color(
                textColor
            )
        );
        return;
    }
    // /**@type {$BlockContainerJS_} */
    // let b;

    let result = summonGateway(
        player,
        block.getPos(),
        targetGateway,
        event.level
    );
    if (result == -1) {
        player.tell(Text.translate("kubejs.conquest.error").color(textColor));
        return;
    }

    event.player.persistentData.put(
        "dragonConquerCurrent",
        conquerStatus(
            bbox.minX(),
            bbox.maxX(),
            bbox.minY(),
            bbox.maxY(),
            bbox.minZ(),
            bbox.maxZ()
        )
    );
    event.player.persistentData.putString(
        "dragonConquerCurrentId",
        structure_id
    );

    // console.log(targetGateway);
    // console.log(player.username);
    // console.log(player.username.toString());
    // console.log(`/open_gateway ${player.username} ${targetGateway}`);

    //event.player.stages.add("dragon_conquest_challenger");

    // console.log(event.player.persistentData.dragonConquerCurrent)

    // event.server.runCommand(
    //     `/open_gateway ${player.username} ${targetGateway}`
    // );

    // console.log(111);
}

BlockEvents.placed((event) => {
    blockPlaced_dragonConquer(event);
});
