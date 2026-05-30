/**
 * ROOM 房间类
 *
 * @property {((obj: import("../char/character.js").CHARACTER, dir: string) => (boolean|void))} [on_leave] - 离开房间回调
 * @property {((obj: import("../char/character.js").CHARACTER) => void)} [on_before_enter] - 进入房间前回调
 * @property {((obj: import("../char/character.js").CHARACTER) => void)} [on_enter] - 进入房间后回调
 * @property {((dt: number) => void)} [on_heart_beat] - 心跳回调
 * @property {((user: import("../char/user.js").USER) => void)} [on_login] - 登录回调
 * @property {(() => void)} [on_create] - 房间创建回调
 * @property {((type: number) => void)} [on_set_difficulty] - 设置难度回调
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { ITEM } from "../item.js";
import { OBJ } from "../item/obj.js";

// 懒加载 USER/NPC 避免循环依赖: room.js → user.js/npc.js → character.js (TDZ)
let _USER = null;
let _NPC = null;
import("../char/user.js").then(m => { _USER = m.USER; });
import("../char/npc.js").then(m => { _NPC = m.NPC; });

export class ROOM extends ITEM {

    // ============ 核心标识属性 ============

    /** @type {number} 最大容纳物品/角色数 */
    max_item_count = 50;
    /** @type {string} 房间全名(含区域前缀) — 内部赋值用, 外部调long_name() */
    _room_name;

    /**
     * 房间完整显示名称 — 覆写ITEM同名方法
     * @returns {string}
     */
    long_name() { return this._room_name; }
    /** @type {string} 房间描述 */
    desc = "";
    /** @type {string} 所属区域路径 */
    area;

    // ============ 容器与出口 ============

    /** @type {ITEM[]} 房间内的物品和角色 — 运行时CHARACTER或OBJ, is_player/is_equipment判别 */
    items = [];
    /** @type {Object<string, string>|null} 出口映射 {方向: 目标路径} */
    exits = null;
    /** @type {string|null} 出口JSON缓存 */
    room_exits_json = null;
    /** @type {Object<string, string>|null} 隐藏物品映射 */
    hidden_items = null;
    /** @type {string|null} 命令JSON缓存 */
    commands_json = null;

    // ============ 层级关系 ============

    /** @type {AREA|null} 所属区域 */
    parent = null;

    // ============ 副本与镜像 ============

    /** @type {boolean} 是否为副本房间 */
    is_copy_room = false;
    /** @type {boolean} 是否为镜像房间 */
    is_shadow = false;
    /** @type {boolean} 是否禁止创建镜像 */
    no_shadow = false;
    /** @type {number} 房间创建时间戳 */
    create_time = 0;
    /** @type {Object<string, ROOM>|null} 副本房间映射 {ownerId: ROOM} */
    copy_rooms = null;
    /** @type {ROOM[]|null} 镜像房间列表 */
    shadow_rooms = null;
    /** @type {ROOM[]|null} 公共房间列表 */
    public_rooms = null;
    /** @type {string|null} 副本持有者ID */
    owner = null;

    // ============ 玩法相关 ============

    /** @type {Object<string, *>|null} 副本临时数据 */
    temp = null;
    /** @type {boolean} 是否可钓鱼 */
    can_diaoyu = false;

    /**
     * 玩家/物件离开房间
     * @param {ITEM} obj - 离开的对象
     * @param {string} dir - 离开方向
     * @param {string} leave_msg - 离开消息
     * @returns {boolean|undefined}
     */
    do_leave(obj, dir, leave_msg) {
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
     * @returns {void}
     */
    do_enter(obj, isshow, in_msg) {
        this.on_before_enter && this.on_before_enter(obj);
        if (obj.is_player) {
            obj.send(this.to_json());
            this.send_exits(obj);
        }
        this.item_changed(obj, true, in_msg);
        this.on_enter && this.on_enter(obj);
    }

    /**
     * 房间内容物变更(核心方法)。处理物件进出房间的完整流程：
     * 通知房间内玩家、触发 on_enter/on_leave 回调、维护 items 数组。
     * @param {ITEM} obj - 变更对象
     * @param {boolean} isin - true进入 false离开
     * @param {string} [changed_msg] - 变更消息(广播给房间内玩家)
     * @param {string} [dir] - 移动方向
     * @returns {boolean|undefined} 返回 false 表示阻止
     */
    item_changed(obj, isin, changed_msg, dir) {
        if (!obj) return;
        let msg;
        let obj_index = -1, isshow = !obj.query_temp('hidden');
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
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
    item_json(item, isin) {
        if (!item) return "";
        const str = [];
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
    items_to_json() {
        const str = ['{"type":"items","items":['];
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
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
    set_npc() {

        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (typeof name == "string") name = [name, 1];
            const obj_path = name[0];
            if (!obj_path) continue;
            for (let j = 0; j < name[1]; j++) {
                const obj = _NPC.CLONE(obj_path);
                if (obj) {
                    this.items.push(obj);
                    obj.environment = this;
                }
            }
        }
    }

    /**
     * 设置房间物品(创建时调用)
     * @param {...(string|[string, number])} names - 物品路径或[物品路径, 数量]
     */
    set_obj(names) {

        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (typeof name == "string") name = [name, 1];
            const obj = OBJ.CREATE(name[0], name[1]);
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
    set_item(id, name, desc, commands) {
        this.hidden_items = this.hidden_items || [];

        if (commands && typeof commands[0] == "string") {
            commands = [commands];
        }
        const hidden_item = {
            id: id,
            name: name,
            desc: desc,
            commands: commands,
            query_desc: on_look_hidden_item,
            environment: this
        };

        this.hidden_items.push(hidden_item);
        if (commands) {
            for (let j = 0; j < commands.length; j++) {
                this.add_action(commands[j][0], null, commands[j][2]);
            }
        }
        return hidden_item;
    }

    /**
     * 根据ID查找物件(含隐藏物品)
     * @param {string} oid
     * @returns {ITEM|*}
     */
    find_obj(oid) {
        const items = this.items;
        if (!items) return;
        const item = this.find_obj_byid(items, oid);
        if (item) return item;
        if (!this.hidden_items) return;
        for (let i = 0; i < this.hidden_items.length; i++) {
            if (this.hidden_items[i].id == oid) return this.hidden_items[i];
        }
    }

    /**
     * 根据路径查找物件
     * @param {string} path
     * @returns {ITEM|undefined}
     */
    find_by_path(path) {
        const items = this.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
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
    is_here(path) {
        const items = this.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].path == path) {
                return true;
            }
        }
    }

    /**
     * 向房间内所有玩家发送消息
     * @param {string} msg
     */
    notify(msg) {
        if (!this.items) return;
        for (let i = 0; i < this.items.length; i++) {
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
    query_exits(dir) {
        if (this.exits && this.exits[dir]) return true;
        return false;
    }

    /**
     * 添加出口
     * @param {string} dir - 方向名
     * @param {string} rm - 目标房间路径
     */
    add_exit(dir, rm) {
        this.exits = this.exits || {};
        this.exits[dir] = rm;
        this.exits_changed();
    }

    /**
     * 移除出口
     * @param {string} dir
     */
    remove_exit(dir) {
        this.exits = this.exits || {};
        delete this.exits[dir];
        this.exits_changed();
    }

    /**
     * 出口变更后通知所有玩家
     * @returns {void}
     */
    exits_changed() {
        this.room_exits_json = null;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player)
                this.send_exits(this.items[i]);
        }
    }

    /**
     * 向玩家发送出口信息
     * @param {USER} player
     */
    send_exits(player) {
        player.send(this.exitsto_roomjson());
    }

    /**
     * 生成出口JSON
     * @returns {string}
     */
    exitsto_roomjson() {
        if (this.room_exits_json) return this.room_exits_json;
        const obj = {};
        obj.type = "exits";
        obj.items = {};
        if (this.exits) {
            for (let dir in this.exits) {
                if (!this.exits[dir]) continue;
                const rm = ROOM.Get(this.exits[dir]);
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
    to_json() {
        if (this.json) return this.json;
        const obj = {};
        obj.type = "room";
        obj.path = this.path;
        obj.name = this._room_name;
        obj.desc = this.desc;
        obj.commands = [];
        if (this.actions) {
            for (let cmd in this.actions) {
                const name = this.actions[cmd].name;
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
    query_commands() {
        if (this.commands_json) return this.commands_json;
        const json = {};
        json.type = "command";

        json.commands = [];
        if (this.actions) {
            for (let cmd in this.actions) {
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
    refresh(obj) {
        this.json = null;
        this.commands_json = null;
        this.room_exits_json = null;
        const rmname = this.parent.name + "-" + this.name;
        if (this.parent.not_fb || !this.parent.is_copy) {
            this._room_name = rmname;
        } else {
            this._room_name = rmname + "(副本区域)";
        }
        if (obj) {
            for (let i = 0; i < this.items.length; i++) {
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
    get_path() {
        if (this.path) return this.path;
        let str = this.name;
        let area = this.area;
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
    query_recover_room() {
        let area = this.parent;
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
    create(file) {
        const base_room = WORLD.ROOMS[file];

        if (base_room) {
            this.parent = base_room.parent;
            if (this.parent.is_copy) {
                if (this.parent.not_fb) {
                    this._room_name = base_room._room_name;
                } else {
                    this._room_name = base_room._room_name + "(副本区域)";
                }
                this.create_time = Date.now();
                this.is_copy_room = true;
            } else {
                this.is_shadow = true;
                this._room_name = base_room._room_name;

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
    initBaseRoom(file) {
        WORLD.ROOMS[file] = this;

        const area = getAreaByPath(this.path);

        this.parent = area;
        if (!area || !area.is_copy) {
            WORLD.RUN_ROOMS.push(this);
        }
        if (area) {
            if (!area.rooms) area.rooms = [];
            for (let i = 0; i < area.rooms.length; i++) {
                if (area.rooms[i].path == this.path) {
                    area.rooms.splice(i, 1);
                    break;
                }
            }
            area.rooms.push(this);
            this._room_name = area.name + "-" + this.name;
        } else {

            this._room_name = this.name;
        }
    }

    /**
     * 热更新房间
     * @param {string} file
     */
    update(file) {
        this.on_create && this.on_create();
        const oldroom = WORLD.ROOMS[file];
        this.initBaseRoom(file);
        if (!oldroom) return;
        if (oldroom.copy_rooms) {
            this.copy_rooms = {};
            for (let key in oldroom.copy_rooms) {
                const rm = oldroom.copy_rooms[key];
                const newRm = BASE.CREATE(__PATH.MAP, this.path);
                this.replaceRoom(rm, newRm);
                newRm.owner = key;
                this.copy_rooms[key] = newRm;
            }
            oldroom.copy_rooms = null;
        } else {
            if (ROOM.public_rooms) {
                for (let i = 0; i < ROOM.public_rooms.length; i++) {
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
    replaceRoom(oldroom, newRoom) {
        const items = oldroom.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].is_player || items[i].master) {
                newRoom.items.push(items[i]);
                items[i].environment = newRoom;
            }
        }
        oldroom.destroy();
    }

    /**
     * 销毁房间(清空物品和所有者)
     * @returns {void}
     */
    destroy() {
        this.items.length = 0;
        this.owner = null;
    }

    /**
     * 房间心跳
     * @param {number} dt
     */
    heart_beat(dt) {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].is_player)
                this.items[i].heart_beat(dt);
        }
        this.on_heart_beat && this.on_heart_beat(dt);
    }

    /**
     * 是否是副本房间
     * @returns {boolean}
     */
    is_copy() {
        if (!this.parent) return false;
        return this.parent.is_copy;
    }

    /**
     * 是否是副本(会消失的)
     * @returns {boolean}
     */
    is_fb() {
        if (!this.parent) return false;
        return this.parent.is_copy && !this.parent.not_fb;
    }

    /**
     * 是否是入口房间
     * @returns {boolean}
     */
    is_enter() {
        if (!this.parent) return false;
        return this.parent.first == this.path;
    }

    /**
     * 查询副本入口房间
     * @param {string} id - 队伍/用户ID
     * @returns {ROOM|undefined}
     */
    query_fb_first(id) {
        if (!this.parent || !this.parent.is_copy || !this.parent.rooms) return;
        return this.parent.rooms[0].query_copy(id);
    }

    /**
     * 查询副本房间
     * @param {string} id
     * @returns {ROOM|undefined}
     */
    query_copy(id) {

        if (!this.copy_rooms) this.copy_rooms = {};
        return this.copy_rooms[id];
    }

    /**
     * 根据用户查找对应副本
     * @param {USER} user
     * @returns {ROOM}
     */
    query_copy2(user) {
        const id = this.parent.query_owner(user);
        if (!id) return this;
        return this.query_copy(id);
    }

    /**
     * 清除副本区域
     * @param {USER} me
     */
    clear_copy(me) {
        if (!this.owner) return;
        const id = this.parent.query_owner(me);
        if (id !== this.owner) return;
        const name = "fb/";
        for (let key in me.temp) {
            if (key.startsWith(name)) {
                me.temp[key] = null;
            }
        }
        if (me.team) {
            for (let i = 0; i < me.team.length; i++) {
                const tm = me.team[i];
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
    create_copy2(me, diff_type) {

        const id = this.parent.query_owner(me);
        if (!id) return;
        return this.create_copy(id, diff_type || 0);
    }

    /**
     * 创建副本房间
     * @param {string} id - 副本所有者ID
     * @param {number} diff_type - 难度
     * @returns {ROOM|undefined}
     */
    create_copy(id, diff_type) {
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
    create_by_area(area, id, diff_type) {
        if (area.rooms) {
            for (let i = 0; i < area.rooms.length; i++) {
                const base_room = area.rooms[i];
                const copy_room = BASE.CREATE(__PATH.MAP, base_room.path);
                if (!copy_room) continue;
                copy_room.set_difficulty(diff_type);
                if (!base_room.copy_rooms) base_room.copy_rooms = {};
                base_room.copy_rooms[id] = copy_room;
                copy_room.owner = id;
            }
        }
        if (area.areas) {
            for (let i = 0; i < area.areas.length; i++) {
                this.create_by_area(area.areas[i], id);
            }
        }
    }

    /**
     * 创建房间投影(人满时)
     * @returns {ROOM|undefined}
     */
    create_shadow() {
        if (this.is_copy_room || this.no_shadow) return;

        if (!this.shadow_rooms) this.shadow_rooms = [];
        for (let i = 0; i < this.shadow_rooms.length; i++) {
            if (!this.shadow_rooms[i].is_full()) {
                return this.shadow_rooms[i];
            }
        }
        const shadow = BASE.CREATE(__PATH.MAP, this.path);
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
    clear_by_area(area, id) {
        if (area.rooms) {
            for (let i = 0; i < area.rooms.length; i++) {
                const base_room = area.rooms[i];
                if (base_room.copy_rooms) {
                    const rm = base_room.copy_rooms[id];
                    if (rm) {
                        WORLD.RUN_ROOMS.remove(rm);
                        rm.destroy();
                        delete base_room.copy_rooms[id];

                    }

                }
            }
        }
        if (area.areas) {
            for (let i = 0; i < area.areas.length; i++) {
                this.clear_by_area(area.areas[i], id);
            }
        }
    }

    /**
     * 根据路径获取房间
     * @param {string} path
     * @returns {ROOM|undefined}
     */
    static Get(path) {
        const rm = WORLD.ROOMS[path];

        if (!rm) return console.log("room %s is not exist", path);
        return rm;
    }


    /**
     * 查询副本房间的临时数据(按玩家隔离)
     * @param {string} name
     * @param {*} [def]
     * @param {USER} me
     * @returns {*}
     */
    query_temp(name, def, me) {
        const first = this.query_fb_first(me.query_teamid());
        if (!first) return;
        if (!first.temp) return;
        const item = first.temp[name];
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
     * 设置副本临时数据(按玩家隔离)
     * @param {string} name
     * @param {*} value
     * @param {number} [time]
     * @param {USER} me
     */
    set_temp(name, value, time, me) {
        const first = this.query_fb_first(me.query_teamid());
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
     * 累加副本临时数据(按玩家隔离)
     * @param {string} name
     * @param {number} value
     * @param {number} [time]
     * @param {USER} me
     * @returns {number}
     */
    add_temp(name, value, time, me) {
        const val = this.query_temp(name, 0, me) + value;
        this.set_temp(name, val, time, me);
        return val;
    }

    /**
     * 随机获取一个公共房间
     * @returns {ROOM}
     */
    static RANDOM() {
        if (!this.public_rooms) {
            this.public_rooms = [];
            for (let i = 0; i < WORLD.AREAS.length; i++) {
                if (WORLD.AREAS[i].is_area && !WORLD.AREAS[i].is_public) {
                    const rms = WORLD.AREAS[i].rooms;

                    for (let j = 0; j < rms.length; j++) {
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
    set_difficulty(type) {
        this.on_set_difficulty && this.on_set_difficulty(type);
    }

    /**
     * 向房间内所有玩家发送消息
     * @param {string} msg
     */
    send(msg) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                this.items[i].send(msg);
            }
        }
    }

    /**
     * 查找房间中第一个玩家
     * @returns {USER|undefined}
     */
    find_me() {
        for (let i = 0; i < this.items.length; i++) {
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
    query(id) {
        const room = ROOM.Get(id);
        if (!room) return null;
        if (this.owner) {
            return room.query_copy(this.owner);
        }
        return room;
    }
}

/**
 * 隐藏物品被look时的描述
 * @param {USER} player
 * @returns {string}
 */
function on_look_hidden_item(player) {
    if (this.json) return this.json;
    const json = {};
    json.type = "item";
    json.desc = this.desc;
    if (this.commands) {
        json.commands = [];
        for (let i = 0; i < this.commands.length; i++) {
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
 * 根据路径查找所属区域
 * @param {string} path
 * @returns {AREA|undefined}
 */
function getAreaByPath(path) {
    let index = path.lastIndexOf("/");
    path = path.substr(0, index + 1);
    const items = WORLD.AREAS;
    for (let i = 0; i < items.length; i++) {
        if (items[i].room_path == path) return items[i];
    }
}

globalThis.ROOM = ROOM;
