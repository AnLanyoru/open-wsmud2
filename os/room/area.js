/**
 * AREA 区域类 - 管理一组房间
 */

/** @type {function} */
AREA = function () {
    /** @type {ROOM[]} */
    this.rooms = [];
    /** @type {string[]} */
    this.map = [];
    this.name = "";
    this.is_area = false;
    /** @type {string|null} 入口房间路径 */
    this.first = null;
    this.is_show = true;
    /** @type {boolean} 是否是副本区域 */
    this.is_copy = false;
    this.expend = 10;
    this.is_multi = false;
    this.index = 0;
    this.exp = 1000;
    this.pot = 1000;
}
AREA.inherits(BASE);

/**
 * 区域创建回调
 * @param {string} path
 */
AREA.prototype.create = function (path) {
    WORLD.AREAS.push(this);
    if (this.family) {
        FAMILIES[this.family].area = this;
    }
}

/**
 * 根据ID获取区域
 * @param {string} id
 * @returns {AREA|undefined}
 */
AREA.Get = function (id) {
    if (!WORLD.AREAS) return;
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        if (WORLD.AREAS[i].id == id) return WORLD.AREAS[i];
    }
}

/**
 * 玩家离开区域回调
 * @param {USER} me
 */
AREA.prototype.on_leaved = function (me) {
}

/**
 * 玩家离开前回调
 * @param {USER} me
 * @returns {boolean}
 */
AREA.prototype.on_leave = function (me) {
    return true;
}

/**
 * 玩家进入后回调
 * @param {USER} me
 */
AREA.prototype.on_enterd = function (me) {
}

/**
 * 玩家进入前回调
 * @param {USER} me
 * @returns {boolean}
 */
AREA.prototype.on_enter = function (me) {
    return true;
}

/**
 * 查找子区域
 * @param {string} path
 */
AREA.prototype.find_area = function (path) {
}

/**
 * 查询指定难度的通关记录
 * @param {number} diff
 * @returns {*}
 */
AREA.prototype.is_record = function (diff) {
    return this["record_" + diff];
}

/**
 * 查询区域经验奖励
 * @returns {number}
 */
AREA.prototype.query_exp = function () {
    var lv = this.fb_index || 0;
    return 1000 + lv * 100;
}

/**
 * 查询区域描述
 * @returns {string}
 */
AREA.prototype.query_desc = function () {
    return this.desc;
}

/** 清除缓存 */
AREA.prototype.clear = function () {
    this.json = null;
    this.drop_list = null;
    this.diff_drop_list = null;
}

/**
 * 查询普通掉落列表
 * @param {boolean} [isdiff]
 * @returns {Array<*>}
 */
AREA.prototype.query_drops = function (isdiff) {
    if (isdiff) return this.query_diff_drops();
    if (this.drop_list) return this.drop_list;
    var items = [];
    for (var i = 0; i < this.rooms.length; i++) {
        var rm = this.rooms[i];
        for (var j = 0; j < rm.items.length; j++) {
            if (rm.items[j].drop_list) {
                items.push(rm.items[j].drop_list);
            }

        }
    }
    this.query_npc_drops(this.drop_npcs0, items);
    this.drop_list = items;
    return this.drop_list;
}

/**
 * 查询NPC掉落
 * @param {string[]} npcs
 * @param {Array<*>} items
 */
AREA.prototype.query_npc_drops = function (npcs, items) {
    if (!npcs || !npcs.length) return;
    for (var i = 0; i < npcs.length; i++) {
        var npc = NPC.GET(npcs[i]);
        if (!npc || !npc.drop_list) continue;
        items.push(npc.drop_list)
    }
}

/**
 * 查询困难模式掉落
 * @param {boolean} [isdiff]
 * @returns {Array<*>}
 */
AREA.prototype.query_diff_drops = function (isdiff) {
    if (this.diff_drop_list) return this.diff_drop_list;
    var items = [];
    for (var i = 0; i < this.rooms.length; i++) {
        var rm = this.rooms[i];
        for (var j = 0; j < rm.items.length; j++) {
            if (rm.items[j].drop_list) {
                items.push(rm.items[j].drop_list);
            }
        }
    }
    this.query_npc_drops(this.drop_npcs1, items);
    this.diff_drop_list = items;
    return this.diff_drop_list;
}

/**
 * 区域热更新
 * @param {string} path
 */
AREA.prototype.update = function (path) {
    WORLD.COMMANDS["jh"].map_json = null;
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        if (WORLD.AREAS[i].path == path) {
            var old_area = WORLD.AREAS[i];
            WORLD.AREAS[i] = this;
            this.rooms = old_area.rooms;
            if (this.rooms) {
                for (let room of this.rooms) {
                    room.parent = this;
                }
            }
            old_area.rooms = null;
            if (this.family) {
                FAMILIES[this.family].area = this;
            }
            return;
        }
    }
    this.create(path);
}

/**
 * 查询掉落物品列表
 * @returns {*}
 */
AREA.prototype.query_drop_items = function () {
    return this.drop_items;
}

/**
 * 查询区域命令
 * @returns {*}
 */
AREA.prototype.query_actions = function () {
    return this.actions;
}

