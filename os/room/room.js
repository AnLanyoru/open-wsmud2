
ROOM = function () {
    this.name = "房间";
    this.desc = "";
    this.items = [];
    this.parent = null;
}
ROOM.inherits(ITEM);
ROOM.prototype.max_item_count = 50;

ROOM.prototype.do_leave = function (obj, dir, leave_msg) {
    if (this.on_leave && this.on_leave(obj, dir) == false) {
        return false;
    }
    if (this.item_changed(obj, false, leave_msg, dir) == false) {
        return false;
    }

}
ROOM.prototype.do_enter = function (obj, isshow, in_msg) {
    this.on_before_enter && this.on_before_enter(obj);
    if (obj.is_player) {
        obj.send(this.to_json());
        this.send_exits(obj);
    }
    this.item_changed(obj, true, in_msg);
    this.on_enter && this.on_enter(obj);
}
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
        //添加隐藏物品的命令到房间的actions，命令不能重复
    }
    return hidden_item;
}

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
ROOM.prototype.find_by_path = function (path) {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].path == path) {
            return items[i];
        }
    }
}
ROOM.prototype.is_here = function (path) {
    var items = this.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
        if (items[i].path == path) {
            return true;
        }
    }
}
ROOM.prototype.notify = function (msg) {
    if (!this.items) return;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            this.items[i].notify(msg);
        }
    }
}
ROOM.prototype.query_exits = function (dir) {
    if (this.exits && this.exits[dir]) return true;
    return false;
}
ROOM.prototype.add_exit = function (dir, rm) {
    this.exits = this.exits || {};
    this.exits[dir] = rm;
    this.exits_changed();
}
ROOM.prototype.remove_exit = function (dir) {
    this.exits = this.exits || {};
    delete this.exits[dir];
    this.exits_changed();
}

ROOM.prototype.exits_changed = function () {
    this.room_exits_json = null;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player)
            this.send_exits(this.items[i]);
    }
}
ROOM.prototype.send_exits = function (player) {
    player.send(this.exitsto_roomjson());
}
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
        // this.send_exits(obj);
    }

}
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
ROOM.prototype.create = function (file) {
    var base_room = WORLD.ROOMS[file];

    if (base_room) {
        this.parent = base_room.parent;
        if (this.parent.is_copy) {
            //副本区域
            if (this.parent.not_fb) {
                this.long_name = base_room.long_name;
            } else {
                this.long_name = base_room.long_name + "(副本区域)";
            }
            this.create_time = Date.now();
            this.is_copy_room = true;
        } else {
            //投影区域 房间人满了后
            this.is_shadow = true;
            this.long_name = base_room.long_name;//+ "(" + UTIL.to_c(base_room.shadow_rooms.length + 1) + "号)";

        }
        WORLD.RUN_ROOMS.push(this);
    } else {
        this.initBaseRoom(file);
    }

    this.on_create && this.on_create();
}
ROOM.prototype.initBaseRoom = function (file) {
    WORLD.ROOMS[file] = this;

    var area = getAreaByPath(this.path);

    this.parent = area;
    if (!area || !area.is_copy) {
        //如果是副本，第一个被创建的不放在运行的房间
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
ROOM.prototype.destroy = function () {
    this.items.length = 0;
    this.owner = null;
}
ROOM.prototype.heart_beat = function (dt) {
    for (var i = 0; i < this.items.length; i++) {
        if (!this.items[i].is_player)
            this.items[i].heart_beat(dt);
    }
    this.on_heart_beat && this.on_heart_beat(dt);
}
ROOM.prototype.is_copy = function () {
    if (!this.parent) return false;
    return this.parent.is_copy;
}
ROOM.prototype.is_fb = function () {
    if (!this.parent) return false;
    return this.parent.is_copy && !this.parent.not_fb;
}
ROOM.prototype.is_enter = function () {
    if (!this.parent) return false;
    return this.parent.first == this.path;
}
ROOM.prototype.query_fb_first = function (id) {
    //查询副本入口
    if (!this.parent || !this.parent.is_copy || !this.parent.rooms) return;
    return this.parent.rooms[0].query_copy(id);
}
ROOM.prototype.query_copy = function (id) {

    if (!this.copy_rooms) this.copy_rooms = {};
    return this.copy_rooms[id];
}
ROOM.prototype.query_copy2 = function (user) {
    var id = this.parent.query_owner(user);
    if (!id) return this;
    return this.query_copy(id);
}
ROOM.prototype.clear_copy = function (me) {
    //清除复制的副本，四个位置，换地图，完成副本，复活，彻底掉线
    //但是又不能清除不是自己的副本，比如帮派
    if (!this.owner) return;
    let id = this.parent.query_owner(me);
    if (id !== this.owner) return;//只能清除自己或队伍创建的副本
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

ROOM.prototype.create_copy2 = function (me, diff_type) {

    var id = this.parent.query_owner(me);
    if (!id) return;
    return this.create_copy(id, diff_type || 0);
}
ROOM.prototype.create_copy = function (id, diff_type) {
    //第一次创建副本，从入口开始创建，把所在区域所有房间都创建一遍
    if (!this.parent) return;
    // var rooms = [];
    this.create_by_area(this.parent, id, diff_type);
    //this.add_fbroom(rooms);
    return this.query_copy(id);
}
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
ROOM.prototype.create_shadow = function () {
    //当房间人满了后 进入房间就另外创建一个房间投影,这种类型的房间最好不要放NPC,物品
    //这种房间创建了不销毁，重复使用
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

function getAreaByPath(path) {
    var index = path.lastIndexOf("/");
    path = path.substr(0, index + 1);
    var items = WORLD.AREAS;
    for (var i = 0; i < items.length; i++) {
        if (items[i].room_path == path) return items[i];
    }
}
ROOM.Get = function (path) {
    var rm = WORLD.ROOMS[path];

    if (!rm) return console.log("room %s is not exist", path);
    // if (!rm) throw new Error(path + "is not exist");
    return rm;
}


//房间存储数据，存在当前用户或队伍的房间区域的第一个房间里面，在副本销毁时候会释放
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
ROOM.prototype.add_temp = function (me, name, value, time) {
    let val = this.query_temp(me, name, 0) + value;
    this.set_temp(me, name, val, time);
    return val;
}
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
ROOM.prototype.set_difficulty = function (type) {
    this.on_set_difficulty && this.on_set_difficulty(type);
}
ROOM.prototype.send = function (msg) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            this.items[i].send(msg);
        }
    }
}
ROOM.prototype.find_me = function () {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].is_player) {
            return this.items[i];
        }
    }
}
ROOM.prototype.query = function (id) {
    let room = ROOM.Get(id);
    if (!room) return null;
    if (this.owner) {
        return room.query_copy(this.owner);
    }
    return room;
}
