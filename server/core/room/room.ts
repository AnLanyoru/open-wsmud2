/**
 * ROOM 房间类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { ITEM } from "../item.js";
import { OBJ } from "../item/obj.js";
import type { AREA } from "./area.js";

// 声明全局 __PATH (由服务器启动时设置)
declare const __PATH: Record<string, string>;

// 懒加载 USER/NPC 避免循环依赖
let _USER: any = null;
let _NPC: any = null;
import("../char/user.js").then((m: any) => { _USER = m.USER; });
import("../char/npc.js").then((m: any) => { _NPC = m.NPC; });

/**
 * 隐藏物品被look时的描述
 * @param this - 隐藏物品对象
 * @param player - 查看的玩家
 */
function on_look_hidden_item(this: any, player: any): string {
    if (this.json) return this.json;
    const json: Record<string, any> = {};
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
    this.json = JSON.stringify(json);
    return this.json;
}

/**
 * 根据路径查找所属区域
 * @param path - 房间路径
 */
function getAreaByPath(path: string): AREA | undefined {
    let index = path.lastIndexOf("/");
    path = path.substr(0, index + 1);
    const items = WORLD.AREAS;
    for (let i = 0; i < items.length; i++) {
        if ((items[i] as any).room_path == path) return items[i] as any;
    }
}

export class ROOM extends ITEM {

    // ============ 核心标识属性 ============

    /** 最大容纳物品/角色数 */
    max_item_count: number = 50;
    /** 房间全名(含区域前缀) — 内部赋值用, 外部调long_name() */
    _room_name!: string;

    /**
     * 房间完整显示名称 — 覆写ITEM同名方法
     */
    long_name(): string { return this._room_name; }

    /** 房间描述 */
    desc: string = "";
    /** 所属区域路径(由资源文件设置) */
    area: any;

    // ============ 容器与出口 ============

    /** 房间内的物品和角色 — 运行时CHARACTER或OBJ */
    items: any[] = [];
    /** 出口映射 {方向: 目标路径} */
    exits: Record<string, string> | null = null;
    /** 出口JSON缓存 */
    room_exits_json: string | null = null;
    /** 隐藏物品映射 */
    hidden_items: any[] | null = null;
    /** 命令JSON缓存 */
    commands_json: string | null = null;

    // ============ 层级关系 ============

    /** 所属区域 */
    parent: any = null;

    // ============ 副本与镜像 ============

    /** 是否为副本房间 */
    is_copy_room: boolean = false;
    /** 是否为镜像房间 */
    is_shadow: boolean = false;
    /** 是否禁止创建镜像 */
    no_shadow: boolean = false;
    /** 房间创建时间戳 */
    create_time: number = 0;
    /** 副本房间映射 {ownerId: ROOM} */
    copy_rooms: Record<string, ROOM> | null = null;
    /** 镜像房间列表 */
    shadow_rooms: ROOM[] | null = null;
    /** 副本持有者ID */
    owner: string | null = null;

    // ============ 玩法相关 ============

    /** 副本临时数据 */
    temp: Record<string, any> | null = null;
    /** 是否可钓鱼 */
    can_diaoyu: boolean = false;

    // ============ 公共房间缓存(静态) ============

    /** 公共房间列表(由RANDOM静态方法管理) */
    static public_rooms: any[] | null = null;

    // ============ 回调(由资源文件设置) ============

    /** 离开房间回调 */
    on_leave?: (obj: any, dir: string) => boolean | void;
    /** 进入房间前回调 */
    on_before_enter?: (obj: any) => void;
    /** 进入房间后回调 */
    on_enter?: (obj: any) => void;
    /** 心跳回调 */
    on_heart_beat?: (dt: number) => void;
    /** 登录回调 */
    on_login?: (user: any) => void;
    /** 房间创建回调 */
    on_create?: () => void;
    /** 设置难度回调 */
    on_set_difficulty?: (type: number) => void;

    // ============ 核心方法 ============

    /**
     * 玩家/物件离开房间
     * @param obj - 离开的对象
     * @param dir - 离开方向
     * @param leave_msg - 离开消息
     */
    do_leave(obj: any, dir: string, leave_msg: string): boolean | undefined {
        if (this.on_leave && this.on_leave(obj, dir) == false) {
            return false;
        }
        if (this.item_changed(obj, false, leave_msg, dir) == false) {
            return false;
        }
    }

    /**
     * 玩家/物件进入房间
     * @param obj - 进入的对象
     * @param isshow - 是否显示
     * @param in_msg - 进入消息
     */
    do_enter(obj: any, isshow: boolean, in_msg: string): void {
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
     * @param obj - 变更对象
     * @param isin - true进入 false离开
     * @param changed_msg - 变更消息(广播给房间内玩家)
     * @param dir - 移动方向
     */
    item_changed(obj: any, isin: boolean, changed_msg?: string, dir?: string): boolean | undefined {
        if (!obj) return;
        let msg: string | undefined;
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
     * @param item - 物件
     * @param isin - 是否进入
     */
    item_json(item: any, isin: boolean): string {
        if (!item) return "";
        const str: string[] = [];
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
     */
    items_to_json(): string {
        const str: string[] = ['{"type":"items","items":['];
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
                        item.item_types = item.hp > 0
                            ? `,m:${(item.on_checkskill || item.on_master) ? 1 : 0},l:${item.sell_list ? 1 : 0},f:${item.master ? 1 : 0}`
                            : ",o:1";
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
     * @param arguments - NPC路径或[NPC路径, 数量]
     */
    set_npc(...args: any[]): void {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
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
     * @param names - 物品路径或[物品路径, 数量]
     */
    set_obj(...names: any[]): void {
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
     * @param id - 物品ID
     * @param name - 名称
     * @param desc - 描述
     * @param commands - 命令列表
     */
    set_item(id: string, name: string, desc: string, commands?: any[]): any {
        this.hidden_items = this.hidden_items || [];

        if (commands && typeof commands[0] == "string") {
            commands = [commands];
        }
        const hidden_item: any = {
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
     * @param oid
     */
    find_obj(oid: string): any {
        const items = this.items;
        if (!items) return;
        const item = ITEM.prototype.find_obj_byid.call(this, items, oid);
        if (item) return item;
        if (!this.hidden_items) return;
        for (let i = 0; i < this.hidden_items.length; i++) {
            if (this.hidden_items[i].id == oid) return this.hidden_items[i];
        }
    }

    /**
     * 根据路径查找物件
     * @param path
     */
    find_by_path(path: string): any | undefined {
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
     * @param path
     */
    is_here(path: string): boolean | undefined {
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
     * @param msg
     */
    notify(msg: string): void {
        if (!this.items) return;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                this.items[i].notify(msg);
            }
        }
    }

    /**
     * 查询指定方向是否存在出口
     * @param dir
     */
    query_exits(dir: string): boolean {
        if (this.exits && this.exits[dir]) return true;
        return false;
    }

    /**
     * 添加出口
     * @param dir - 方向名
     * @param rm - 目标房间路径
     */
    add_exit(dir: string, rm: string): void {
        this.exits = this.exits || {};
        this.exits[dir] = rm;
        this.exits_changed();
    }

    /**
     * 移除出口
     * @param dir
     */
    remove_exit(dir: string): void {
        this.exits = this.exits || {};
        delete this.exits[dir];
        this.exits_changed();
    }

    /**
     * 出口变更后通知所有玩家
     */
    exits_changed(): void {
        this.room_exits_json = null;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player)
                this.send_exits(this.items[i]);
        }
    }

    /**
     * 向玩家发送出口信息
     * @param player
     */
    send_exits(player: any): void {
        player.send(this.exitsto_roomjson());
    }

    /**
     * 生成出口JSON
     */
    exitsto_roomjson(): string {
        if (this.room_exits_json) return this.room_exits_json;
        const obj: Record<string, any> = {};
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
     */
    to_json(): string {
        if (this.json) return this.json;
        const obj: Record<string, any> = {};
        obj.type = "room";
        obj.path = this.path;
        obj.name = this._room_name;
        obj.desc = this.desc;
        obj.commands = [];
        if (this.actions) {
            for (let cmd in this.actions) {
                const name = (this.actions as any)[cmd].name;
                if (name)
                    obj.commands.push({
                        cmd: cmd,
                        name: name
                    });
            }
        }
        if (this.is_copy_room && !(this.parent as any).not_fb) {
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
     */
    query_commands(): string {
        if (this.commands_json) return this.commands_json;
        const json: Record<string, any> = {};
        json.type = "command";

        json.commands = [];
        if (this.actions) {
            for (let cmd in this.actions) {
                json.commands.push({
                    name: (this.actions as any)[cmd].name,
                    cmd: cmd
                });
            }
        }

        this.commands_json = JSON.stringify(json);
        return this.commands_json;
    }

    /**
     * 刷新房间数据(热更新)
     * @param obj
     */
    refresh(obj?: any): void {
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
     */
    get_path(): string {
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
     */
    query_recover_room(): string {
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
     * @param file - 文件名
     */
    create(file: string): void {
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
     * @param file
     */
    initBaseRoom(file: string): void {
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
     * @param file
     */
    update(file: string): void {
        this.on_create && this.on_create();
        const oldroom = WORLD.ROOMS[file];
        this.initBaseRoom(file);
        if (!oldroom) return;
        if ((oldroom as any).copy_rooms) {
            this.copy_rooms = {};
            for (let key in (oldroom as any).copy_rooms) {
                const rm = (oldroom as any).copy_rooms[key];
                const newRm = BASE.CREATE(__PATH.MAP, this.path) as ROOM;
                this.replaceRoom(rm, newRm);
                newRm.owner = key;
                if (!this.copy_rooms) this.copy_rooms = {};
                this.copy_rooms[key] = newRm;
            }
            (oldroom as any).copy_rooms = null;
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
     * @param oldroom
     * @param newRoom
     */
    replaceRoom(oldroom: any, newRoom: any): void {
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
     */
    destroy(): void {
        this.items.length = 0;
        this.owner = null;
    }

    /**
     * 房间心跳
     * @param dt
     */
    heart_beat(dt: number): void {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].is_player)
                this.items[i].heart_beat(dt);
        }
        this.on_heart_beat && this.on_heart_beat(dt);
    }

    /**
     * 是否是副本房间
     */
    is_copy(): boolean {
        if (!this.parent) return false;
        return this.parent.is_copy;
    }

    /**
     * 是否是副本(会消失的)
     */
    is_fb(): boolean {
        if (!this.parent) return false;
        return this.parent.is_copy && !this.parent.not_fb;
    }

    /**
     * 是否是入口房间
     */
    is_enter(): boolean {
        if (!this.parent) return false;
        return this.parent.first == this.path;
    }

    /**
     * 查询副本入口房间
     * @param id - 队伍/用户ID
     */
    query_fb_first(id: string): any {
        if (!this.parent || !this.parent.is_copy || !this.parent.rooms) return;
        return this.parent.rooms[0].query_copy(id);
    }

    /**
     * 查询副本房间
     * @param id
     */
    query_copy(id: string): any {
        if (!this.copy_rooms) this.copy_rooms = {};
        return (this.copy_rooms as Record<string, any>)[id];
    }

    /**
     * 根据用户查找对应副本
     * @param user
     */
    query_copy2(user: any): any {
        const id = this.parent.query_owner(user);
        if (!id) return this;
        return this.query_copy(id);
    }

    /**
     * 清除副本区域
     * @param me
     */
    clear_copy(me: any): void {
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
     * @param me
     * @param diff_type - 难度
     */
    create_copy2(me: any, diff_type?: number): any {
        const id = this.parent.query_owner(me);
        if (!id) return;
        return this.create_copy(id, diff_type || 0);
    }

    /**
     * 创建副本房间
     * @param id - 副本所有者ID
     * @param diff_type - 难度
     */
    create_copy(id: string, diff_type: number): any {
        if (!this.parent) return;
        this.create_by_area(this.parent, id, diff_type);
        return this.query_copy(id);
    }

    /**
     * 按区域递归创建副本
     * @param area
     * @param id
     * @param diff_type
     */
    create_by_area(area: any, id: string, diff_type: number): void {
        if (area.rooms) {
            for (let i = 0; i < area.rooms.length; i++) {
                const base_room = area.rooms[i];
                const copy_room = BASE.CREATE(__PATH.MAP, base_room.path) as ROOM;
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
     */
    create_shadow(): any {
        if (this.is_copy_room || this.no_shadow) return;

        if (!this.shadow_rooms) this.shadow_rooms = [];
        for (let i = 0; i < this.shadow_rooms.length; i++) {
            if (!this.shadow_rooms[i].is_full()) {
                return this.shadow_rooms[i];
            }
        }
        const shadow = BASE.CREATE(__PATH.MAP, this.path) as ROOM;
        if (shadow) {
            this.shadow_rooms.push(shadow);
        }
        return shadow;
    }

    /**
     * 按区域递归清除副本
     * @param area
     * @param id
     */
    clear_by_area(area: any, id: string): void {
        if (area.rooms) {
            for (let i = 0; i < area.rooms.length; i++) {
                const base_room = area.rooms[i];
                if (base_room.copy_rooms) {
                    const rm = base_room.copy_rooms[id];
                    if (rm) {
                        const idx = WORLD.RUN_ROOMS.indexOf(rm);
                        if (idx !== -1) WORLD.RUN_ROOMS.splice(idx, 1);
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

    // ============ 静态方法 ============

    /**
     * 根据路径获取房间
     * @param path
     */
    static Get(path: string): any {
        const rm = WORLD.ROOMS[path];
        if (!rm) return console.log("room %s is not exist", path);
        return rm;
    }

    /**
     * 查询副本房间的临时数据(按玩家隔离)
     * @param name
     * @param def
     * @param me
     */
    query_temp(name: string, def?: any, me?: any): any {
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
        return item ?? def;
    }

    /**
     * 设置副本临时数据(按玩家隔离)
     * @param name
     * @param value
     * @param time
     * @param me
     */
    set_temp(name: string, value: any, time?: number, me?: any): void {
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
     * @param name
     * @param value
     * @param time
     * @param me
     */
    add_temp(name: string, value: number, time?: number, me?: any): number {
        const val = this.query_temp(name, 0, me) + value;
        this.set_temp(name, val, time, me);
        return val;
    }

    /**
     * 随机获取一个公共房间
     */
    static RANDOM(): any {
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
     * @param type
     */
    set_difficulty(type: number): void {
        this.on_set_difficulty && this.on_set_difficulty(type);
    }

    /**
     * 向房间内所有玩家发送消息
     * @param msg
     */
    send(msg: string): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                this.items[i].send(msg);
            }
        }
    }

    /**
     * 查找房间中第一个玩家
     */
    find_me(): any {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                return this.items[i];
            }
        }
    }

    /**
     * 查询房间(考虑副本)
     * @param id - 房间路径
     */
    query(id: string): any {
        const room = ROOM.Get(id);
        if (!room) return null;
        if (this.owner) {
            return room.query_copy(this.owner);
        }
        return room;
    }
}

(globalThis as any).ROOM = ROOM;
