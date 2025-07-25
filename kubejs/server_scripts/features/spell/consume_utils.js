//priority: 2

/**
 *
 * @param {$ServerLevel_} level
 * @param {$CompoundTag_ & {type: string, nbt: $CompoundTag_}} tag
 * @returns {$Entity_}
 */
function recoverConsumedEntity(level, tag) {
    let newEntity = level.createEntity(tag.getString("type"));
    newEntity.mergeNbt(tag.nbt);
    return newEntity;
}

/**
 *
 * @param {$Entity_} tag
 * @returns {$CompoundTag_ & {type: string, nbt: $CompoundTag_}}
 */
function createConsumedEntityTag(entity) {
    let tag = new $CompoundTag();
    tag.type = entity.type;
    tag.nbt = entity.nbt;
    return tag;
}
