/**
 * ROOM 房间类
 */

/** @type {function} */
ROOM = function () {
    this.name = "房间";
    this.desc = "";
    /** @type {ITEM[]} */
    this.items = [];
    /** @type {AREA|null} */
    this.parent = null;
}
ROOM.inherits(ITEM);
/** @type {number} 房间最大容纳人数 */
ROOM.prototype.max_item_count = 50;

/**
 * 玩家/物件离开房间
 * @param {ITEM} obj - 离开的对象
 * @param {string} dir - 离开方向
 * @param {string} leave_msg - 离开消息
 * @returns {boolean|undefined}
 */
ROOM.prototype.do_leave = function (obj, dir, leave_msg) {
    if (this.on_leave && this.on_leave(obj, dir) == false) {
        return false;
    }
    if (this.item_changed(obj, false, leave_msg, dir) == false) {
        return false;
    }

}

/**
 * 玩家/物件进入房间
 * @param {ITEM} obj - 进入的对象
 * @param {boolean} isshow - 是否显示
 * @param {string} in_msg - 进入消息
 */
ROOM.prototype.do_enter = function (obj, isshow, in_msg) {
    this.on_before_enter && this.on_before_enter(obj);
    if (obj.is_player) {
        obj.send(this.to_json());
        this.send_exits(obj);
    }
    this.item_changed(obj, true, in_msg);
    this.on_enter && this.on_enter(obj);
}

/**
 * 房间内容物变更(核心方法)
 * @param {ITEM} obj - 变更对象
 * @param {boolean} isin - true进入 false离开
 * @param {string} [changed_msg] - 变更消息
 * @param {string} [dir] - 方向
 * @returns {boolean|undefined}
 */
ROOM.prototype.item_changed = function (obj, isin, changed_msg, dir) {
    if (!obj) return;
    var msg;
    var obj_index = -1, isshow = !obj.query_temp('hidden');
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item == obj) {
            obj_index = i;
            continue;
        }
        if (item.is_player && isshow) {
            if (!msg) msg = this.item_json(obj, isin);
            item.send(msg);

            if (changed_msg && item != obj && !item.query_setting("off_move")) {
                item.send(changed_msg);
            }

        } else {
            if (obj.hp) {
                if (isin && item.on_enter) {
                    item.on_enter(obj);
                } else if (!isin && item.on_leave) {
                    if (item.on_leave(obj, dir) == false) return false;
                }
            }
        }
    }

    if (isin) {
        obj.environment = this;
        if (obj_index == -1) {
            this.items.push(obj);
            if (obj.is_player) obj.send(this.items_to_json());

        } else if (obj.is_player) {
            if (!msg) msg = this.item_json(obj, isin);
            obj.send(msg);
        }
    } else if (obj_index > -1) {
        this.items.splice(obj_index, 1);
        obj.environment = null;
    }
}

/**
 * 生成物件JSON消息
 * @param {ITEM} item - 物件
 * @param {boolean} isin - 是否进入
 * @returns {string}
 */
ROOM.prototype.item_json = function (item, isin) {
    if (!item) return "";
    var str = [];
    if (isin) {
        str.push('{"type":"itemadd",');
        str.push("id:\"");
        str.push(item.id);
        str.push("\",name:\"");
        str.push(item.long_name());
        str.push("\"");
        if (item.is_player) {
            str.push(",p:1");
        }
        if (item.appdend_status) {
            str.push(",mp:");
            str.push(item.mp);
            str.push(",hp:");
            str.push(item.hp);
            str.push(",max_mp:");
            str.push(item.max_mp);
            str.push(",max_hp:");
            str.push(item.max_hp);
            item.appdend_status(str);
        }
        str.push("}");
    } else {
        str.push('{"type":"itemremove",id:"');
        str.push(item.id);
        str.push('"}');
    }
    return str.join("");
}

/**
 * 生成所有物件列表JSON
 * @returns {string}
 */
ROOM.prototype.items_to_json = function () {
    var str = ['{"type":"items","items":['];
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (!item.is_hidden()) {
            str.push("{id:\"");
            str.push(item.id);
            str.push("\",name:\"");
            str.push(item.long_name());
            str.push("\"");
            if (item.is_player) {
                str.push(",p:1");
            } else {
                if (!item.item_types) {
                    item.item_types = item.hp > 0 ? `,m:${(item.on_checkskill || item.on_master) ? 1 : 0},l:${item.sell_list ? 1 : 0},f:${item.master ? 1 : 0}` : ",o:1";
                }
                str.push(item.item_types);
            }
            if (item.appdend_status) {
                str.push(",mp:");
                str.push(item.mp);
                str.push(",hp:");
                str.push(item.hp);
                str.push(",max_mp:");
                str.push(item.max_mp);
                str.push(",max_hp:");
                str.push(item.max_hp);

                item.appdend_status(str);
            }
            str.push("},");
        }
    }
    str.push("0]}");
    return str.join("");
}

/**
 * 设置房间NPC(创建时调用)
 * @param {...(string|[string, number])} arguments - NPC路径或[NPC路径, 数量]
 */
ROOM.prototype.set_npc = function () {

    for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i];
        if (typeof name == "string") name = [name, 1];
        var obj_path = name[0];
        if (!obj_path) continue;
        for (var j = 0; j < name[1]; j++) {
            var obj = NPC.CLONE(obj_path);
            if (obj) {
                this.items.push(obj);
                obj.environment = this;
            }
        }
    }
}

/**
 * 设置房间物品(创建时调用)
 * @param {...(string|[string, number])} arguments - 物品路径或[物品路径, 数量]
 */
ROOM.prototype.set_obj = function (names) {

    for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i];
        if (typeof name == "string") name = [name, 1];
        var obj = OBJ.CREATE(name[0], name[1]);
        if (obj) {
            this.items.push(obj);
        }

    }

}

/**
 * 设置隐藏物品(需look才能发现)
 * @param {string} id - 物品ID
 * @param {string} name - 名称
 * @param {string} desc - 描述
 * @param {Array<[string, string, function]>} commands - 命令列表
 * @returns {*} 隐藏物品对象
 */
ROOM.prototype.set_item = function (id, name, desc, commands) {
    this.hidden_items = this.hidden_items || [];

    if (commands && typeof commands[0] == "string") {
        commands = [commands];
    }
    let hidden_item = {
        id: id,
        name: name,
        desc: desc,
        commands: commands,
        query_desc: on_look_hidden_item,
        environment: this
    };

    this.hidden_items.push(hidden_item);
    if (commands) {
        for (var j = 0; j < commands.length; j++) {
            this.add_action(commands[j][0], null, commands[j][2]);
        }
    }
    return hidden_item;
}

/**
 * 隐藏物品被look时的描述
 * @param {USER} player
 * @returns {string}
 */
function on_look_hidden_item(player) {
    if (this.json) return this.json;
    var json = {};
    json.type = "item";
    json.desc = this.desc;
    if (this.commands) {
        json.commands = [];
        for (var i = 0; i < this.commands.length; i++) {
            if (this.commands[i][1])
                json.commands.push({
                    cmd: this.commands[i][0] + " " + this.id,
                    name: this.commands[i][1]
                });
        }
    }
    this.json = JSON.stringify(json)
    return this.json;
}

/**
 * 根据ID查找物件(含隐藏物品)
 * @param {string} oid
 * @returns {ITEM|*}
 */
ROOM.prototype.find_obj = function (oid) {
    var items = this.items;
    if (!items) return;
    var item = this.find_obj_byid(items, oid);
    if (item) return item;
    if (!this.hidden_items) return;
    for (var i = 0; i < this.hidden_items.length; i++) {
        if (this.hidden_items[i].id == oid) return this.hidden_items[i];
    }
}

/**
 * 根据路径查找物件
 * @param {string} path
 * @returns {ITEM|undefined}
 */
ROOM.prototype.find_by_path = function (path) {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].path == path) {
            return items[i];
        }
    }
}

/**
 * 房间是否包含指定路径的物件
 * @param {string} path
 * @returns {boolean}
 */
ROOM.prototype.is_here = function (path) {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].path == path) {
            return true;
        }
    }
}

/**
 * 向房间内所有玩家发送消息
 * @param {string} msg
 */
ROOM.prototype.notify = function (msg) {
    if (!this.items) return;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            this.items[i].notify(msg);
        }
    }
}

/**
 * 查询指定方向是否存在出口
 * @param {string} dir
 * @returns {boolean}
 */
ROOM.prototype.query_exits = function (dir) {
    if (this.exits && this.exits[dir]) return true;
    return false;
}

/**
 * 添加出口
 * @param {string} dir - 方向名
 * @param {string} rm - 目标房间路径
 */
ROOM.prototype.add_exit = function (dir, rm) {
    this.exits = this.exits || {};
    this.exits[dir] = rm;
    this.exits_changed();
}

/**
 * 移除出口
 * @param {string} dir
 */
ROOM.prototype.remove_exit = function (dir) {
    this.exits = this.exits || {};
    delete this.exits[dir];
    this.exits_changed();
}

/** 出口变更后通知所有玩家 */
ROOM.prototype.exits_changed = function () {
    this.room_exits_json = null;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player)
            this.send_exits(this.items[i]);
    }
}

/**
 * 向玩家发送出口信息
 * @param {USER} player
 */
ROOM.prototype.send_exits = function (player) {
    player.send(this.exitsto_roomjson());
}

/**
 * 生成出口JSON
 * @returns {string}
 */
ROOM.prototype.exitsto_roomjson = function () {
    if (this.room_exits_json) return this.room_exits_json;
    var obj = {};
    obj.type = "exits";
    obj.items = {};
    if (this.exits) {
        for (var dir in this.exits) {
            if (!this.exits[dir]) continue;
            var rm = ROOM.Get(this.exits[dir]);
            if (!rm) continue;
            obj.items[dir] = rm.name;
        }
    }
    this.room_exits_json = JSON.stringify(obj);
    return this.room_exits_json;
}

/**
 * 生成房间JSON(含命令)
 * @returns {string}
 */
ROOM.prototype.to_json = function () {
    if (this.json) return this.json;
    var obj = {};
    obj.type = "room";
    obj.path = this.path;
    obj.name = this.long_name;
    obj.desc = this.desc;
    obj.commands = [];
    if (this.actions) {
        for (var cmd in this.actions) {
            var name = this.actions[cmd].name;
            if (name)
                obj.commands.push({
                    cmd: cmd,
                    name: name
                });
        }
    }
    if (this.is_copy_room && !this.parent.not_fb) {
        obj.commands.push({
            cmd: "cr",
            name: "完成副本"
        });
    }
    this.json = JSON.stringify(obj);
    return this.json;

}

/**
 * 查询命令列表JSON
 * @returns {string}
 */
ROOM.prototype.query_commands = function () {
    if (this.commands_json) return this.commands_json;
    var json = {};
    json.type = "command";

    json.commands = [];
    if (this.actions) {
        for (var cmd in this.actions) {
            json.commands.push({
                name: this.actions[cmd].name,
                cmd: cmd
            });
        }
    }

    this.commands_json = JSON.stringify(json)
    return this.commands_json;
}

/**
 * 刷新房间数据(热更新)
 * @param {*} [obj]
 */
ROOM.prototype.refresh = function (obj) {
    this.json = null;
    this.commands_json = null;
    this.room_exits_json = null;
    var rmname = this.parent.name + "-" + this.name;
    if (this.parent.not_fb || !this.parent.is_copy) {
        this.long_name = rmname;
    } else {
        this.long_name = rmname + "(副本区域)";
    }
    if (obj) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                this.items[i].send(this.to_json());
                this.send_exits(this.items[i]);
                this.items[i].send(this.items_to_json());
            }
        }
    }

}

/**
 * 获取房间完整路径
 * @returns {string}
 */
ROOM.prototype.get_path = function () {
    if (this.path) return this.path;
    var str = this.name;
    var area = this.area;
    while (area) {
        str = area.name + "-" + str;
        area = area.parent;
    }
    this.path = str;
    return this.path;
}

/**
 * 查询复活房间路径
 * @returns {string}
 */
ROOM.prototype.query_recover_room = function () {
    var area = this.parent;
    while (area) {
        if (area.recover_room) {
            return area.recover_room;
        }
        area = area.parent;
    }
    return "yz/wumiao";
}

/**
 * 房间创建回调
 * @param {string} file - 文件名
 */
ROOM.prototype.create = function (file) {
    var base_room = WORLD.ROOMS[file];

    if (base_room) {
        this.parent = base_room.parent;
        if (this.parent.is_copy) {
            if (this.parent.not_fb) {
                this.long_name = base_room.long_name;
            } else {
                this.long_name = base_room.long_name + "(副本区域)";
            }
            this.create_time = Date.now();
            this.is_copy_room = true;
        } else {
            this.is_shadow = true;
            this.long_name = base_room.long_name;

        }
        WORLD.RUN_ROOMS.push(this);
    } else {
        this.initBaseRoom(file);
    }

    this.on_create && this.on_create();
}

/**
 * 初始化基础房间(模板)
 * @param {string} file
 */
ROOM.prototype.initBaseRoom = function (file) {
    WORLD.ROOMS[file] = this;

    var area = getAreaByPath(this.path);

    this.parent = area;
    if (!area || !area.is_copy) {
        WORLD.RUN_ROOMS.push(this);
    }
    if (area) {
        if (!area.rooms) area.rooms = [];
        for (var i = 0; i < area.rooms.length; i++) {
            if (area.rooms[i].path == this.path) {
                area.rooms.splice(i, 1);
                break;
            }
        }
        area.rooms.push(this);
        this.long_name = area.name + "-" + this.name;
    } else {

        this.long_name = this.name;
    }
}

/**
 * 热更新房间
 * @param {string} file
 */
ROOM.prototype.update = function (file) {
    this.on_create && this.on_create();
    var oldroom = WORLD.ROOMS[file];
    this.initBaseRoom(file);
    if (!oldroom) return;
    if (oldroom.copy_rooms) {
        this.copy_rooms = {};
        for (var key in oldroom.copy_rooms) {
            var rm = oldroom.copy_rooms[key];
            var newRm = BASE.CREATE(__PATH.MAP, this.path);
            this.replaceRoom(rm, newRm);
            newRm.owner = key;
            this.copy_rooms[key] = newRm;
        }
        oldroom.copy_rooms = null;
    } else {
        if (ROOM.public_rooms) {
            for (var i = 0; i < ROOM.public_rooms.length; i++) {
                if (ROOM.public_rooms[i] == oldroom) {
                    ROOM.public_rooms[i] = this;
                    break;
                }
            }
        }
    }
}

/**
 * 替换房间(迁移玩家)
 * @param {ROOM} oldroom
 * @param {ROOM} newRoom
 */
ROOM.prototype.replaceRoom = function (oldroom, newRoom) {
    var items = oldroom.items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].is_player || items[i].master) {
            newRoom.items.push(items[i]);
            items[i].environment = newRoom;
        }
    }
    oldroom.destroy();
}

/** 销毁房间 */
ROOM.prototype.destroy = function () {
    this.items.length = 0;
    this.owner = null;
}

/**
 * 房间心跳
 * @param {number} dt
 */
ROOM.prototype.heart_beat = function (dt) {
    for (var i = 0; i < this.items.length; i++) {
        if (!this.items[i].is_player)
            this.items[i].heart_beat(dt);
    }
    this.on_heart_beat && this.on_heart_beat(dt);
}

/**
 * 是否是副本房间
 * @returns {boolean}
 */
ROOM.prototype.is_copy = function () {
    if (!this.parent) return false;
    return this.parent.is_copy;
}

/**
 * 是否是副本(会消失的)
 * @returns {boolean}
 */
ROOM.prototype.is_fb = function () {
    if (!this.parent) return false;
    return this.parent.is_copy && !this.parent.not_fb;
}

/**
 * 是否是入口房间
 * @returns {boolean}
 */
ROOM.prototype.is_enter = function () {
    if (!this.parent) return false;
    return this.parent.first == this.path;
}

/**
 * 查询副本入口房间
 * @param {string} id - 队伍/用户ID
 * @returns {ROOM|undefined}
 */
ROOM.prototype.query_fb_first = function (id) {
    if (!this.parent || !this.parent.is_copy || !this.parent.rooms) return;
    return this.parent.rooms[0].query_copy(id);
}

/**
 * 查询副本房间
 * @param {string} id
 * @returns {ROOM|undefined}
 */
ROOM.prototype.query_copy = function (id) {

    if (!this.copy_rooms) this.copy_rooms = {};
    return this.copy_rooms[id];
}

/**
 * 根据用户查找对应副本
 * @param {USER} user
 * @returns {ROOM}
 */
ROOM.prototype.query_copy2 = function (user) {
    var id = this.parent.query_owner(user);
    if (!id) return this;
    return this.query_copy(id);
}

/**
 * 清除副本区域
 * @param {USER} me
 */
ROOM.prototype.clear_copy = function (me) {
    if (!this.owner) return;
    let id = this.parent.query_owner(me);
    if (id !== this.owner) return;
    var name = "fb/";
    for (var key in me.temp) {
        if (key.startsWith(name)) {
            me.temp[key] = null;
        }
    }
    if (me.team) {
        for (var i = 0; i < me.team.length; i++) {
            let tm = me.team[i];
            if (tm !== me && tm.environment && tm.environment.parent === this.parent
                && tm.environment.owner == this.owner) {
                return;
            }
        }
    }
    this.clear_by_area(this.parent, this.owner);
}

/**
 * 为用户创建副本
 * @param {USER} me
 * @param {number} [diff_type] - 难度
 * @returns {ROOM|undefined}
 */
ROOM.prototype.create_copy2 = function (me, diff_type) {

    var id = this.parent.query_owner(me);
    if (!id) return;
    return this.create_copy(id, diff_type || 0);
}

/**
 * 创建副本房间
 * @param {string} id - 副本所有者ID
 * @param {number} diff_type - 难度
 * @returns {ROOM|undefined}
 */
ROOM.prototype.create_copy = function (id, diff_type) {
    if (!this.parent) return;
    this.create_by_area(this.parent, id, diff_type);
    return this.query_copy(id);
}

/**
 * 按区域递归创建副本
 * @param {AREA} area
 * @param {string} id
 * @param {number} diff_type
 */
ROOM.prototype.create_by_area = function (area, id, diff_type) {
    if (area.rooms) {
        for (var i = 0; i < area.rooms.length; i++) {
            var base_room = area.rooms[i];
            var copy_room = BASE.CREATE(__PATH.MAP, base_room.path);
            if (!copy_room) continue;
            copy_room.set_difficulty(diff_type);
            if (!base_room.copy_rooms) base_room.copy_rooms = {};
            base_room.copy_rooms[id] = copy_room;
            copy_room.owner = id;
        }
    }
    if (area.areas) {
        for (var i = 0; i < area.areas.length; i++) {
            this.create_by_area(area.areas[i], id);
        }
    }
}

/**
 * 创建房间投影(人满时)
 * @returns {ROOM|undefined}
 */
ROOM.prototype.create_shadow = function () {
    if (this.is_copy_room || this.no_shadow) return;

    if (!this.shadow_rooms) this.shadow_rooms = [];
    for (var i = 0; i < this.shadow_rooms.length; i++) {
        if (!this.shadow_rooms[i].is_full()) {
            return this.shadow_rooms[i];
        }
    }
    var shadow = BASE.CREATE(__PATH.MAP, this.path);
    if (shadow) {
        this.shadow_rooms.push(shadow);
    }
    return shadow;
}

/**
 * 按区域递归清除副本
 * @param {AREA} area
 * @param {string} id
 */
ROOM.prototype.clear_by_area = function (area, id) {
    if (area.rooms) {
        for (var i = 0; i < area.rooms.length; i++) {
            var base_room = area.rooms[i];
            if (base_room.copy_rooms) {
                var rm = base_room.copy_rooms[id];
                if (rm) {
                    WORLD.RUN_ROOMS.remove(rm);
                    rm.destroy();
                    delete base_room.copy_rooms[id];

                }

            }
        }
    }
    if (area.areas) {
        for (var i = 0; i < area.areas.length; i++) {
            this.clear_by_area(area.areas[i], id);
        }
    }
}

/**
 * 根据路径查找所属区域
 * @param {string} path
 * @returns {AREA|undefined}
 */
function getAreaByPath(path) {
    var index = path.lastIndexOf("/");
    path = path.substr(0, index + 1);
    var items = WORLD.AREAS;
    for (var i = 0; i < items.length; i++) {
        if (items[i].room_path == path) return items[i];
    }
}

/**
 * 根据路径获取房间
 * @param {string} path
 * @returns {ROOM|undefined}
 */
ROOM.Get = function (path) {
    var rm = WORLD.ROOMS[path];

    if (!rm) return console.log("room %s is not exist", path);
    return rm;
}


/**
 * 查询副本房间的临时数据
 * @param {USER} me
 * @param {string} name
 * @param {*} [def]
 * @returns {*}
 */
ROOM.prototype.query_temp = function (me, name, def) {
    var first = this.query_fb_first(me.query_teamid());
    if (!first) return;
    if (!first.temp) return;
    var item = first.temp[name];
    if (item && item.e) {
        if (Date.now() <= item.e) {
            return item.v;
        }
        first.temp[name] = null;
        return def;
    }
    return item || def;
}

/**
 * 设置副本临时数据
 * @param {USER} me
 * @param {string} name
 * @param {*} value
 * @param {number} [time]
 */
ROOM.prototype.set_temp = function (me, name, value, time) {
    var first = this.query_fb_first(me.query_teamid());
    if (!first) return;
    if (!first.temp) first.temp = {};
    if (time) {
        first.temp[name] = {
            v: value,
            e: Date.now() + time
        };
    } else {
        first.temp[name] = value;
    }
}

/**
 * 累加副本临时数据
 * @param {USER} me
 * @param {string} name
 * @param {number} value
 * @param {number} [time]
 * @returns {number}
 */
ROOM.prototype.add_temp = function (me, name, value, time) {
    let val = this.query_temp(me, name, 0) + value;
    this.set_temp(me, name, val, time);
    return val;
}

/**
 * 随机获取一个公共房间
 * @returns {ROOM}
 */
ROOM.RANDOM = function () {
    if (!this.public_rooms) {
        this.public_rooms = [];
        for (var i = 0; i < WORLD.AREAS.length; i++) {
            if (WORLD.AREAS[i].is_area && !WORLD.AREAS[i].is_public) {
                var rms = WORLD.AREAS[i].rooms;

                for (var j = 0; j < rms.length; j++) {
                    if (rms[j].max_item_count > 1)
                        this.public_rooms.push(rms[j]);
                }
            }
        }
    }
    return this.public_rooms.random();
}

/**
 * 设置副本难度
 * @param {number} type
 */
ROOM.prototype.set_difficulty = function (type) {
    this.on_set_difficulty && this.on_set_difficulty(type);
}

/**
 * 向房间内所有玩家发送消息
 * @param {string} msg
 */
ROOM.prototype.send = function (msg) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            this.items[i].send(msg);
        }
    }
}

/**
 * 查找房间中第一个玩家
 * @returns {USER|undefined}
 */
ROOM.prototype.find_me = function () {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            return this.items[i];
        }
    }
}

/**
 * 查询房间(考虑副本)
 * @param {string} id - 房间路径
 * @returns {ROOM|null}
 */
ROOM.prototype.query = function (id) {
    let room = ROOM.Get(id);
    if (!room) return null;
    if (this.owner) {
        return room.query_copy(this.owner);
    }
    return room;
}
