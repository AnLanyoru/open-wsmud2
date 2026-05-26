AREA = function () {
    this.rooms = [];
    this.map = [];
    this.name = "";
    this.is_area = false;
    this.first = null;
    this.is_show = true;
    this.is_copy = false;
    this.expend = 10;
    this.is_multi = false;
    this.index = 0;
    this.exp = 1000;
    this.pot = 1000;
}
AREA.inherits(BASE);
AREA.prototype.create = function (path) {
    WORLD.AREAS.push(this);
    if (this.family) {
        FAMILIES[this.family].area = this;
    }
}
AREA.Get = function (id) {
    if (!WORLD.AREAS) return;
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        if (WORLD.AREAS[i].id == id) return WORLD.AREAS[i];
    }
}
AREA.prototype.on_leaved = function (me) {
    //离开后
}
AREA.prototype.on_leave = function (me) {
    //进入前
    return true;
}
AREA.prototype.on_enterd = function (me) {
    //进入后
}
AREA.prototype.on_enter = function (me) {
    //进入前
    return true;
}
AREA.prototype.find_area = function (path) {
}
AREA.prototype.is_record = function (diff) {
    return this["record_" + diff];
}
AREA.prototype.query_exp = function () {
    var lv = this.fb_index || 0;
    return 1000 + lv * 100;
}

AREA.prototype.query_desc = function () {
    return this.desc;
}

AREA.prototype.clear = function () {
    this.json = null;
    this.drop_list = null;
    this.diff_drop_list = null;
}
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
AREA.prototype.query_npc_drops = function (npcs, items) {
    if (!npcs || !npcs.length) return;
    for (var i = 0; i < npcs.length; i++) {
        var npc = NPC.GET(npcs[i]);
        if (!npc || !npc.drop_list) continue;
        items.push(npc.drop_list)
    }
}
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
AREA.Get = function (id) {
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        if (WORLD.AREAS[i].id == id) {
            return WORLD.AREAS[i];
        }
    }
}
AREA.prototype.query_drop_items = function () {
    return this.drop_items;
}
AREA.prototype.query_actions = function () {
    return this.actions;
}

