/**
 * ROOM 房间类
 */
import { BASE } from '../base.js';
import { WORLD } from '../world.js';
import { ITEM, RoomAction } from '../item.js';
import { OBJ } from '../item/obj.js';
import { encodeBinaryFrame, encodeTextFrame, WsSocket } from '../net-ws.js';
import { FMASK } from '../templates.js';
import type { AREA } from './area.js';
import { CHARACTER } from '../char/character.js';
import { NPC } from '../char/npc.js';
import type { USER } from '../char/user.js';
import { ItemCommandsJson } from '../char/follower.js';
import { BATCH_MODE, markRoomDirty } from '../world.js';

// 声明全局 __PATH (由服务器启动时设置)
declare const __PATH: Record<string, string>;

/**
 * 隐藏物品被look时的描述
 * @param this - 隐藏物品对象
 * @param player - 查看的玩家
 */
function on_look_hidden_item(this: ITEM, player: USER): string {
    if (this.json) return this.json;
    const json: ItemCommandsJson = {
        type: 'item',
        desc: this.desc,
        commands:
            this.commands
                ?.filter(cmd => cmd[0])
                .map(cmd => ({ cmd: cmd[0] + ' ' + this.id, name: cmd[1] })) ?? [],
    };
    this.json = JSON.stringify(json);
    return this.json;
}

/**
 * 根据路径查找所属区域
 * @param path - 房间路径
 */
function getAreaByPath(path: string): AREA | undefined {
    let index = path.lastIndexOf('/');
    path = path.slice(0, index + 1);
    const items = WORLD.AREAS;
    for (let i = 0; i < items.length; i++) {
        if ((items[i] as AREA).room_path == path) return items[i] as AREA;
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
    long_name(): string {
        return this._room_name;
    }

    /** 房间描述 */
    desc: string = '';
    /** 所属区域路径(由资源文件设置) */
    area: AREA | null;

    // ============ 容器与出口 ============

    /** 房间内的物品和角色 — 运行时CHARACTER或OBJ */
    items: ITEM[] = [];
    /** 出口映射 {方向: 目标路径} */
    exits: Record<string, string> | null = null;
    /** 出口JSON缓存 */
    room_exits_json: string | null = null;
    /** 隐藏物品映射 */
    hidden_items: ITEM[] | null = null;
    /** 命令JSON缓存 */
    commands_json: string | null = null;
    /** items_to_json 缓存 — 物件进出时失效，避免每次进房重建 1000 项 JSON */
    _items_json: string | null = null;

    // ============ 层级关系 ============

    /** 所属区域 */
    parent: AREA | null = null;

    // ============ 副本与镜像 ============
    /** 是否为不持久化房间 */
    no_save?: boolean;
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
    /** NPC生成记录 — set_npc自动记录参数，供on_clone重放 */
    _npc_records: [string, number][] = [];

    // ============ 广播批处理缓冲区 ============

    /**
     * 二进制子帧并行缓冲区（按调用顺序，两数组长度始终相等）—
     * 用并行数组替代 { payload, isCombat } 对象，消除每帧对象分配（万/秒级广播下避免 GC 压力）。
     * V8 走 PACKED_ELEMENTS 快路径，number push 是值类型不产生堆对象。
     */
    _batch_all_payloads: Buffer[] = [];
    _batch_all_combat: number[] = [];  // 0=非战斗, 1=战斗；用 number[] 而非 boolean[] 以走 V8 快路径
    /** 批次中是否包含战斗消息 */
    _batch_has_combat: boolean = false;
    /** 固定 16ms 推送周期，对齐浏览器 60Hz 渲染帧 */
    _batch_delay: number = 16;
    /**
     * 文本帧（itemadd/itemremove/移动消息）缓冲区 — 延迟到 tick flush 合并发送
     * 存储格式：裸 WebSocket payload（已 encodeTextFrame），flush 时按 marker 与 binary 帧交错
     */
    _text_batch: Buffer[] = [];
    /**
     * 待下发 items 列表的进入玩家 — flush 时统一调用 items_to_json() 一次，分发给所有待发玩家。
     * 避免并发进房时每次 push 都失效缓存导致 O(N²) 重建。
     */
    _pending_items_send: USER[] = [];
    /** 入队时间戳（毫秒），0 表示不在 dirty 队列 */
    _batch_timestamp: number = 0;
    /** 脏数据玩家列表 — 下次 flush 时编码为 0x55 刷新帧推送给客户端 */
    _dirty_players: Set<CHARACTER> = new Set();

    // ============ 玩法相关 ============

    /** 副本分数（由 CHARACTER.add_fbscore 设置） */
    score?: number;
    /** 是否可钓鱼 */
    can_diaoyu: boolean = false;
    /** 是否可采药 */
    can_caiyao: boolean = false;
    /** 比武擂台：计时步数 */
    biwu_step?: number;
    /** 是否禁止战斗 */
    no_fight?: boolean;
    /** 是否无法复活 */
    no_relive?: boolean;

    // ============ 公共房间缓存(静态) ============

    /** 公共房间列表(由RANDOM静态方法管理) */
    static public_rooms: ROOM[] | null = null;

    /**
     * 创建房间实例（从干净原型克隆）
     * @param path - 房间路径
     */
    static CREATE(path: string): ROOM {
        const base = WORLD.ROOM_STORE.get(path);
        if (!base) {
            throw new Error('room not preloaded: ' + path);
        }
        const room = Object.create(base) as ROOM;
        room.on_clone();
        room.create(path);
        return room;
    }

    // ============ 回调（由资源文件设置） ============

    /** 离开房间前回调 — 触发时机：do_leave() 开头，物件离开房间前；返回 false 阻止离开 */
    on_leave(obj: ITEM, dir: string): boolean | void {
        return;
    }

    /** 房间中复活回调，目标复活前；返回 false 阻止复活 */
    on_relive?(obj: CHARACTER, is_relive_here: boolean): boolean | void;

    /** 进入房间前回调 — 触发时机：do_enter() 开头，物件进入房间、生成 JSON 之前 */
    on_before_enter(obj: ITEM): void {
        return;
    }

    /** 进入房间后回调 — 触发时机：do_enter() 末尾，物件已加入房间 items 数组之后 */
    on_enter(obj: ITEM): void {
        return;
    }

    /** 心跳回调 — 触发时机：房间每帧 heart_beat(dt) 末尾（在遍历子物品之后） */
    on_heart_beat?(dt: number): void {
        return;
    }

    /** 玩家登录回调 — 触发时机：玩家登录后进入该房间时 */
    on_login?: (user: USER) => void;
    /** 房间创建回调 — 触发时机：create() 方法末尾，房间注册到 WORLD.ROOMS 之后 */
    on_create?: () => void;
    /** 设置难度回调 — 触发时机：副本房间创建副本时调用 set_difficulty(type) */
    on_set_difficulty?: (type: number) => void;

    /** 是否为白天（资源文件注入，用于狼王等 NPC 行为） */
    is_time(): boolean {
        return false;
    }

    /** 创建狼王变身（资源文件注入，lw 任务用） */
    create_lw(me: CHARACTER, npc: CHARACTER, zone: number, msg: string): void {
        return;
    }

    /** 可移动出口列表（资源文件注入，巡逻 NPC 用） */
    move_exits?: string[];

    // ============ 核心方法 ============

    /**
     * 玩家/物件离开房间
     * @param obj - 离开的对象
     * @param dir - 离开方向
     * @param leave_msg - 离开消息（$N=动作主体名字，非二进制模式服务端替换，二进制模式由 pack 转为模板 ID）
     */
    do_leave(
        obj: OBJ | CHARACTER | NPC | USER,
        dir: string,
        leave_msg?: string | number,
    ): boolean | undefined {
        if (this.on_leave(obj, dir) == false) {
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
     * @param in_msg - 进入消息（$N=动作主体名字，非二进制模式服务端替换，二进制模式由 pack 转为模板 ID）
     */
    do_enter(obj: OBJ | CHARACTER | NPC | USER, isshow: boolean, in_msg?: string | number): void {
        this.on_before_enter && this.on_before_enter(obj);
        if (obj.check_player()) {
            obj.send(this.to_json());
            this.send_exits(obj);
        }
        this.item_changed(obj, true, in_msg);
        this.on_enter(obj);
    }

    /**
     * 同步模式下的广播：直接 socket.write，不经过 batch
     * 仅在 BATCH_MODE === 0 时使用
     */
    private _direct_broadcast(payload: Buffer): void {
        const items = this.items;
        for (let i = 0; i < items.length; i++) {
            const item: any = items[i];
            if (!item.is_player || !item.socket || item.no_message) continue;
            item.socket.write(payload);
        }
    }

    /**
     * 房间内容物变更(核心方法)。处理物件进出房间的完整流程：
     * 通知房间内玩家、触发 on_enter/on_leave 回调、维护 items 数组。
     * @param obj - 变更对象
     * @param isin - true进入 false离开
     * @param msg - 消息字符串（$N=动作主体名字）或模板 ID（pack --binary 转换后）
     *              - 非二进制模式：string，服务端替换 $N 为 obj.name 后随 0x56 JSON 下发
     *              - 二进制模式：number（模板 ID），0x57/0x58 帧携带 ID，客户端用 obj.name 替换 $N
     *              - undefined：客户端本地生成（根据 HP/战斗状态）
     * @param dir - 移动方向
     */
    item_changed(
        obj: ITEM,
        isin: boolean,
        msg?: string | number,
        dir?: string,
    ): boolean | undefined {
        if (!obj) return;
        const _batchMode = BATCH_MODE === 1;
        // 广播 payload（0x57/0x58 格式，走二进制批处理帧合并发送）
        let msgPayload: Buffer | undefined;
        let obj_index = -1,
            isshow = !obj.query_temp('hidden');
        const MAX_TEXT = 30240;
        let _broadcastCount = 0;
        const encodeJsonPayload = (json: string): Buffer | undefined => {
            if (json.length >= MAX_TEXT) return undefined;
            const jsonBuf = Buffer.from(json, 'utf8');
            let len = jsonBuf.length;
            const lenBytes: number[] = [];
            while (len >= 0x80) { lenBytes.push((len & 0x7f) | 0x80); len >>>= 7; }
            lenBytes.push(len & 0x7f);
            const framed = Buffer.allocUnsafe(1 + lenBytes.length + jsonBuf.length);
            framed[0] = 0x56;
            for (let i = 0; i < lenBytes.length; i++) framed[1 + i] = lenBytes[i];
            jsonBuf.copy(framed, 1 + lenBytes.length);
            return framed;
        };
        // is_fighting 统一使用 is_fighting() 方法（检查 enemy 数组，避免 fight_type 残留）
        const isFighting = typeof (obj as any).is_fighting === 'function' ? (obj as any).is_fighting() : false;
        // 非二进制模式：消息字符串替换 $N 为 obj.name，拼入 itemadd/itemremove JSON
        // 二进制模式：number = 模板 ID，由 0x57/0x58 帧携带，客户端替换 $N
        const _msgIsTplId = typeof msg === 'number';
        const _resolvedMsg = (msg && !_msgIsTplId) ? (msg as string).replace(/\$N/g, (obj as any).name || '') : undefined;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item == obj) {
                obj_index = i;
                continue;
            }
            if (item.check_player() && isshow) {
                item as USER;
                if (!msgPayload) {
                    if (_batchMode) {
                        // 二进制模式：0x57/0x58 帧，携带模板 ID（number）或不携带（本地生成）
                        const tplId = _msgIsTplId ? (msg as number) : undefined;
                        if (isin) {
                            // fallback JSON 传 _resolvedMsg：batch+string 模式下保留特定消息文本
                            msgPayload = _encode_item_add_frame(obj, isFighting, tplId) || encodeJsonPayload(this.item_json(obj, true, _resolvedMsg));
                        } else {
                            msgPayload = _encode_item_leave_frame(obj, dir, isFighting, tplId);
                        }
                    } else {
                        // 非二进制模式：0x56 JSON，itemadd/itemremove + 可选 msg 字段
                        msgPayload = encodeJsonPayload(this.item_json(obj, isin, _resolvedMsg));
                    }
                }
                if (_batchMode) {
                    if (msgPayload) {
                        this._batch_all_payloads.push(msgPayload);
                        this._batch_all_combat.push(0);
                        _broadcastCount++;
                    }
                } else {
                    // 同步模式：每个玩家直接 socket.write
                    if (msgPayload) {
                        const single = Buffer.concat([BATCH_MARKER, msgPayload]);
                        const framed = encodeBinaryFrame(single);
                        (item as USER).socket?.write(framed);
                        _broadcastCount++;
                    }
                }
            } else {
                if (obj.check_character() && item.check_character()) {
                    if (isin && item.on_enter) {
                        item.on_enter(obj);
                    } else if (!isin && item.on_leave) {
                        if (item.on_leave(obj, dir || '') == false) return false;
                    }
                }
            }
        }
        if (isin) {
            obj.environment = this;
            if (obj_index == -1) {
                this.items.push(obj as CHARACTER | OBJ | NPC);
                this._items_json = null;
                if (obj.check_player()) {
                    if (_batchMode) {
                        this._pending_items_send.push(obj as USER);
                    } else {
                        // 同步模式：立即调用 items_to_json() 并发送
                        const ij = this.items_to_json();
                        obj.send(ij);
                    }
                }
            } else if (obj.check_player()) {
                if (!msgPayload) {
                    if (_batchMode) {
                        const tplId = _msgIsTplId ? (msg as number) : undefined;
                        if (isin) {
                            msgPayload = _encode_item_add_frame(obj as OBJ | CHARACTER | NPC, isFighting, tplId) || encodeJsonPayload(this.item_json(obj as OBJ | CHARACTER | NPC, true, _resolvedMsg));
                        } else {
                            msgPayload = _encode_item_leave_frame(obj as OBJ | CHARACTER | NPC, dir, isFighting, tplId);
                        }
                    } else {
                        msgPayload = encodeJsonPayload(this.item_json(obj as OBJ | CHARACTER | NPC, isin, _resolvedMsg));
                    }
                }
                if (msgPayload) {
                    const single = Buffer.concat([BATCH_MARKER, msgPayload]);
                    const framed = encodeBinaryFrame(single);
                    obj.socket?.write(framed);
                }
            }
        } else if (obj_index > -1) {
            this.items.splice(obj_index, 1);
            this._items_json = null;
            if (obj.check_player()) {
                if (_batchMode) {
                    const pendIdx = this._pending_items_send.indexOf(obj as USER);
                    if (pendIdx !== -1) this._pending_items_send.splice(pendIdx, 1);
                    // 离房前 flush 该玩家的 notify 文本帧，避免消息丢失
                    const player = obj as any;
                    if (player._notify_markers && player._notify_markers.length > 0 && player.socket) {
                        const frames = player._notify_frames;
                        const out: Buffer[] = [];
                        for (let k = 0; k < frames.length; k++) out.push(frames[k]);
                        player.socket.write(Buffer.concat(out));
                        player._notify_markers.length = 0;
                        player._notify_frames.length = 0;
                    }
                }
            }
            if (obj.check_character()) this._dirty_players.delete(obj as CHARACTER);
            obj.environment = undefined;
        }
        if (_batchMode && (_broadcastCount > 0 || this._pending_items_send.length > 0)) {
            markRoomDirty(this);
        }
    }

    /**
     * 生成物件JSON消息
     * @param item - 物件
     * @param isin - 是否进入
     * @param msg - 可选消息字符串（非二进制模式下，$N 已替换为 obj.name 的完整消息）
     */
    item_json(item: ITEM, isin: boolean, msg?: string): string {
        if (!item) return '';
        const str: string[] = [];
        if (isin) {
            str.push('{"type":"itemadd",');
            str.push('id:"');
            str.push(item.id);
            str.push('",name:"');
            str.push(item.long_name());
            str.push('"');
            if (item.is_player) {
                str.push(',p:1');
            }
            if (item.check_character()) {
                const ch = item as CHARACTER;
                str.push(',mp:');
                str.push(String(ch.mp));
                str.push(',hp:');
                str.push(String(ch.hp));
                str.push(',max_mp:');
                str.push(String(ch.max_mp));
                str.push(',max_hp:');
                str.push(String(ch.max_hp));
                // AT 缓存字段：客户端存入 cur_room.items 供 0x12 帧按 ID 查找
                // name=long_name() 供房间列表显示，n=纯名字供 A_NAME/T_NAME 模板填充
                str.push(',w:"');
                str.push(ch.weapon_name() || '');
                str.push('",c:"');
                str.push(ch.call3());
                str.push('",th:"');
                str.push(ch.throwing_name() || '');
                str.push('",n:"');
                str.push(ch.name);
                str.push('"');
                // profile: per/gender/cl — 客户端用于生成面容/武器/衣着进入消息
                str.push(',per:');
                str.push(String(ch.per | 0));
                str.push(',gender:');
                str.push(String(ch.gender | 0));
                str.push(',cl:');
                str.push((ch.equipment && ch.equipment[1]) ? '1' : '0'); // EQUIP_TYPE.CLOTH = 1
                if (ch.append_status) ch.append_status(str);
            }
            if (msg) {
                str.push(',msg:"');
                str.push(msg.replace(/"/g, '\\"'));
                str.push('"');
            }
            str.push('}');
        } else {
            str.push('{"type":"itemremove",id:"');
            str.push(item.id);
            str.push('"');
            if (msg) {
                str.push(',msg:"');
                str.push(msg.replace(/"/g, '\\"'));
                str.push('"');
            }
            str.push('}');
        }
        const _result = str.join('');
        return _result;
    }

    /**
     * 生成所有物件列表JSON（带缓存 — 物件进出时失效）
     */
    items_to_json(): string {
        if (this._items_json !== null) return this._items_json;
        const str: string[] = ['{"type":"items","items":['];
        for (let i = 0; i < this.items.length; i++) {
            const item: Record<string, any> = this.items[i];
            if (!item.is_hidden()) {
                str.push('{id:"');
                str.push(item.id);
                str.push('",name:"');
                str.push(item.long_name());
                str.push('"');
                if (item.is_player) {
                    str.push(',p:1');
                } else {
                    if (!item.item_types) {
                        item.item_types =
                            item.hp > 0
                                ? `,m:${item.on_checkskill || item.on_master ? 1 : 0},l:${item.sell_list ? 1 : 0},f:${item.master ? 1 : 0}`
                                : ',o:1';
                    }
                    str.push(item.item_types);
                }
                if (item.append_status) {
                    str.push(',mp:');
                    str.push(item.mp);
                    str.push(',hp:');
                    str.push(item.hp);
                    str.push(',max_mp:');
                    str.push(item.max_mp);
                    str.push(',max_hp:');
                    str.push(item.max_hp);

                    item.append_status(str);
                }
                // AT 缓存字段：角色物件才有，客户端存入 cur_room.items 供 0x12 帧按 ID 查找
                // name=long_name() 供房间列表显示，n=纯名字供 A_NAME/T_NAME 模板填充
                if (item.check_character?.()) {
                    str.push(',w:"');
                    str.push(item.weapon_name() || '');
                    str.push('",c:"');
                    str.push(item.call3());
                    str.push('",th:"');
                    str.push(item.throwing_name() || '');
                    str.push('",n:"');
                    str.push(item.name);
                    str.push('"');
                    // profile: per/gender/cl — 客户端用于生成面容/武器/衣着进入消息
                    str.push(',per:');
                    str.push(String(item.per | 0));
                    str.push(',gender:');
                    str.push(String(item.gender | 0));
                    str.push(',cl:');
                    str.push((item.equipment && item.equipment[1]) ? '1' : '0'); // EQUIP_TYPE.CLOTH = 1
                }
                str.push('},');
            }
        }
        str.push('0]}');
        this._items_json = str.join('');
        return this._items_json;
    }

    /**
     * 设置房间NPC(创建时调用)
     * @param arguments - NPC路径或[NPC路径, 数量]
     */
    set_npc(...args: (string | [string, number])[]): void {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            if (typeof name == 'string') name = [name, 1];
            const obj_path = name[0];
            if (!obj_path) continue;
            this._npc_records.push([obj_path, name[1]]);
        }
    }

    /**
     * 设置房间物品(创建时调用)
     * @param names - 物品路径或[物品路径, 数量]
     */
    set_obj(...names: (string | [string, number])[]): void {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (typeof name == 'string') name = [name, 1];
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
    set_item(id: string, name: string, desc: string, commands?: RoomAction[] | RoomAction): ITEM {
        this.hidden_items = this.hidden_items || [];
        let cmd_lsit: RoomAction[] = [];
        if (commands && typeof commands[0] == 'string') {
            cmd_lsit = [commands as RoomAction];
        } else {
            cmd_lsit = commands as RoomAction[];
        }
        const hidden_item: ITEM = new ITEM();
        hidden_item.set({
            id: id,
            name: name,
            desc: desc,
            commands: cmd_lsit,
            query_desc: on_look_hidden_item,
            environment: this,
        });

        this.hidden_items.push(hidden_item);
        if (cmd_lsit) {
            for (let j = 0; j < cmd_lsit.length; j++) {
                this.add_action(cmd_lsit[j][0], '', cmd_lsit[j][2]);
            }
        }
        return hidden_item;
    }

    /**
     * 根据ID查找物件(含隐藏物品)
     * @param oid
     */
    find_obj(oid: string): ITEM | undefined {
        const items = this.items;
        if (!items) return;
        const item = this.find_obj_byid.call(this, items, oid);
        if (item) return item;
        if (!this.hidden_items) return;
        for (let i = 0; i < this.hidden_items.length; i++) {
            if (this.hidden_items[i].id == oid) return this.hidden_items[i];
        }
        return;
    }

    /**
     * 根据路径查找物件
     * @param path
     */
    find_by_path(path: string): ITEM | undefined {
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
            if (this.items[i].is_player) this.send_exits(this.items[i]);
        }
    }

    /**
     * 向玩家发送出口信息
     * @param player
     */
    send_exits(player: Record<string, any>): void {
        player.send(this.exitsto_roomjson());
    }

    /**
     * 生成出口JSON
     */
    exitsto_roomjson(): string {
        if (this.room_exits_json) return this.room_exits_json;
        const obj: Record<string, any> = {};
        obj.type = 'exits';
        obj.items = {};
        if (this.exits) {
            for (let dir in this.exits) {
                if (!this.exits[dir]) continue;
                const rm = WORLD.getRoom(this.exits[dir]);
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
        obj.type = 'room';
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
                        name: name,
                    });
            }
        }
        if (this.is_copy_room && !(this.parent as AREA)!.not_fb) {
            obj.commands.push({
                cmd: 'cr',
                name: '完成副本',
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
        json.type = 'command';

        json.commands = [];
        if (this.actions) {
            for (let cmd in this.actions) {
                json.commands.push({
                    name: this.actions[cmd].name,
                    cmd: cmd,
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
    refresh(obj?: Record<string, any>): void {
        this.json = null;
        this.commands_json = null;
        this.room_exits_json = null;
        const rmname = this.parent!.name + '-' + this.name;
        if (this.parent!.not_fb || !this.parent!.is_copy) {
            this._room_name = rmname;
        } else {
            this._room_name = rmname + '(副本区域)';
        }
        if (obj) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item.check_player()) {
                    item.send(this.to_json());
                    this.send_exits(item);
                    item.send(this.items_to_json());
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
        let area: any = this.area;
        while (area) {
            str = area.name + '-' + str;
            area = area.parent;
        }
        this.path = str;
        return this.path;
    }

    /**
     * 查询复活房间路径
     */
    query_recover_room(): string {
        let area: any = this.parent;
        while (area) {
            if (area.recover_room) {
                return area.recover_room;
            }
            area = area.parent;
        }
        return 'yz/wumiao';
    }

    /**
     * 原型克隆回调 — Object.create后初始化可变字段，使其独立于原型
     */
    on_clone(): void {
        // —— 可变引用类型，覆盖为独立副本 ——
        this.items = [];
        // 始终写入 exits 以稳定 V8 隐藏类形状（避免有出口/无出口房间产生不同 own property 集合）
        this.exits = this.exits ? { ...this.exits } : null;
        this._temp_values = new Map();
        this._temp_expiry = new Map();
        this._isolate_events();

        // —— 批处理缓冲区清零（必须创建自有属性，避免 Object.create 原型链共享） ——
        this._batch_all_payloads = [];
        this._batch_all_combat = [];
        this._batch_has_combat = false;
        this._batch_delay = 16;
        this._batch_timestamp = 0;
        this._dirty_players = new Set();
        this._pending_items_send = [];

        // —— 缓存清零 ——
        this.json = null;
        this.room_exits_json = null;
        this.commands_json = null;

        // —— 重放NPC生成（读取原型的_npc_records） ——
        const records = this._npc_records;
        this._npc_records = [];
        if (records) {
            for (let i = 0; i < records.length; i++) {
                const [obj_path, count] = records[i];
                for (let j = 0; j < count; j++) {
                    const obj = NPC.CLONE(obj_path);
                    if (obj) {
                        this.items.push(obj);
                        obj.environment = this;
                    }
                }
            }
        }
    }

    /**
     * 房间创建回调
     * @param file - 文件名
     */
    create(file: string): void {
        const base_room = WORLD.ROOMS.get(file);

        if (base_room) {
            this.parent = base_room.parent;
            if (this.parent && this.parent.is_copy) {
                if (this.parent.not_fb) {
                    this._room_name = base_room._room_name;
                } else {
                    this._room_name = base_room._room_name + '(副本区域)';
                }
                this.create_time = Date.now();
                this.is_copy_room = true;
            } else {
                this.is_shadow = true;
                this._room_name = base_room._room_name;
            }
            WORLD.RUN_ROOMS.push(this);
        } else {
            // 首次创建：this是干净原型，保存后用克隆作为实际房间
            WORLD.ROOM_STORE.set(file, this);
            const active = Object.create(this) as ROOM;
            active.on_clone();
            active.initBaseRoom(file);
        }

        this.on_create && this.on_create();
    }

    /**
     * 初始化基础房间(模板)
     * @param file
     */
    initBaseRoom(file: string): void {
        WORLD.ROOMS.set(file, this);

        const area = getAreaByPath(this.path);

        this.parent = area ?? null;
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
            this._room_name = area.name + '-' + this.name;
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
        const oldroom = WORLD.ROOMS.get(file);

        // 保存新原型，创建新的活跃房间
        WORLD.ROOM_STORE.set(file, this);
        const active = Object.create(this) as ROOM;
        active.on_clone();
        active.initBaseRoom(file);

        // 原型的影子标记需从RUN_ROOMS清除（create时被误加入）
        const idx = WORLD.RUN_ROOMS.indexOf(this);
        if (idx !== -1) WORLD.RUN_ROOMS.splice(idx, 1);

        if (!oldroom) return;
        if (oldroom.copy_rooms) {
            active.copy_rooms = {};
            for (let key in oldroom.copy_rooms) {
                const rm = oldroom.copy_rooms[key];
                const newRm = ROOM.CREATE(active.path);
                active.replaceRoom(rm, newRm);
                newRm.owner = key;
                if (!active.copy_rooms) active.copy_rooms = {};
                active.copy_rooms[key] = newRm;
            }
            oldroom.copy_rooms = null;
        } else {
            if (ROOM.public_rooms) {
                for (let i = 0; i < ROOM.public_rooms.length; i++) {
                    if (ROOM.public_rooms[i] == oldroom) {
                        ROOM.public_rooms[i] = active;
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
    replaceRoom(oldroom: Record<string, any>, newRoom: Record<string, any>): void {
        const items = oldroom.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].is_player || items[i].master) {
                newRoom.items.push(items[i]);
                items[i].environment = newRoom;
                if (items[i].is_player) {
                    // 固定 16ms 推送周期，不再随玩家数动态调整
                }
                // 迁移脏标记：从旧房间脏列表移除（新房间靠 items_to_json 下发全量数据）
                if (items[i].check_character?.()) {
                    oldroom._dirty_players.delete(items[i]);
                }
            }
        }
        oldroom.destroy();
    }

    /**
     * 构建脏数据刷新帧 (op 0x55) — 编码所有脏玩家的新字段数据。
     * 格式: [0x55][1B count][count × ([7B id][1B field_mask][按 mask 顺序的字段...])]
     * field_mask 沿用 8 位 FMASK，字段编码: [1B len][utf8]
     * A_NAME/T_NAME 都映射 cache.n (纯名字)，name 字段仅供房间列表显示
     */
    _build_dirty_refresh_frame(): Buffer | null {
        const dirty = this._dirty_players;
        if (dirty.size === 0) return null;

        const parts: Buffer[] = [];
        let count = 0;
        for (const ch of dirty) {
            // 边界检查：玩家可能已离开房间
            if ((ch as any).environment !== this) continue;
            const df = (ch as any)._dirty_fields || 0;
            if (!df) continue;

            // 将 4 位 DIRTY 掩码扩展为 8 位 FMASK
            let fm = 0;
            if (df & 0x01) fm |= FMASK.A_NAME | FMASK.T_NAME;       // NAME (纯名字，A/T 共用)
            if (df & 0x02) fm |= FMASK.A_WEAPON | FMASK.T_WEAPON;   // WEAPON
            if (df & 0x04) fm |= FMASK.A_CALL3 | FMASK.T_CALL3;     // CALL3
            if (df & 0x10) fm |= FMASK.A_THROW;                     // THROWING

            // 准备字段值（按 FMASK 位顺序）— A_NAME/T_NAME 都用纯名字
            const pureName = ch.name;
            const weapon = ch.weapon_name() || '';
            const call3 = ch.call3();
            const throwing = ch.throwing_name() || '';

            // 编码: [7B id][1B field_mask][fields...]
            const packedId = ch._get_packed_id();
            parts.push(packedId);

            const fmBuf = Buffer.alloc(1);
            fmBuf[0] = fm;
            parts.push(fmBuf);

            // 按 FMASK 位顺序编码字段: A_NAME, A_WEAPON, A_CALL3, T_WEAPON, A_THROW, T_NAME, (0x40保留), T_CALL3
            const fieldValues = [pureName, weapon, call3, weapon, throwing, pureName, '', call3];
            const fieldBits = [FMASK.A_NAME, FMASK.A_WEAPON, FMASK.A_CALL3, FMASK.T_WEAPON, FMASK.A_THROW, FMASK.T_NAME, 0x40, FMASK.T_CALL3];
            for (let i = 0; i < 8; i++) {
                if (fm & fieldBits[i]) {
                    const strBuf = Buffer.from(fieldValues[i], 'utf8');
                    const lenBuf = Buffer.alloc(1);
                    lenBuf[0] = strBuf.length;
                    parts.push(lenBuf, strBuf);
                }
            }

            // 清除脏标记
            (ch as any)._dirty_fields = 0;
            count++;
        }
        if (count === 0) return null;

        // 构建完整帧: [0x55][1B count][...]
        const header = Buffer.alloc(2);
        header[0] = 0x55;
        header[1] = count;
        return Buffer.concat([header, ...parts]);
    }

    /**
     * 刷新二进制批处理 — 合并原始 payload 并编码为单个 WebSocket 帧发送。
     * 首字节 0xFE 为批处理标记，供客户端识别合并帧。
     * 全量下发给所有玩家，主视角消息也统一走批处理。
     * 刷新帧 (0x55) 作为合并帧的首子帧，确保后续 0x12 帧使用最新缓存。
     *
     * 顺序保证：玩家 _notify_markers 标记每个文本帧在 binary 序列中的相对位置，
     * flush 时按 marker 切分 binary 子帧，与文本帧按调用顺序交错输出。
     * 并行数组方案：_batch_all_payloads / _batch_all_combat 及 _notify_markers / _notify_frames
     * 走 V8 PACKED_ELEMENTS 快路径，零对象分配。
     */
    _flush_batch(): void {
        const payloads = this._batch_all_payloads;
        const combatFlags = this._batch_all_combat;
        const hasCombat = this._batch_has_combat;
        const n = payloads.length;
        this._batch_all_payloads = [];
        this._batch_all_combat = [];
        this._batch_has_combat = false;
        this._batch_timestamp = 0;

        // 延迟分发 items 列表：此时所有进房玩家已 push 到 items 数组，
        // items_to_json 只需重建一次，分发给本 tick 内所有进入的玩家
        const pending = this._pending_items_send;
        // 在清空 pending 之前构建 skipSet（这些玩家已通过 items_to_json 收到完整列表，
        // 不应再收到 batch 中的 0x57 自进房帧，避免重复 itemadd 和看到自己的进入消息）
        const skipSet = pending.length > 0 ? new Set(pending) : null;
        if (pending.length > 0) {
            const ij = this.items_to_json();
            for (let i = 0; i < pending.length; i++) {
                pending[i].send(ij);
            }
            pending.length = 0;
        }

        // 编码脏数据刷新帧（作为首个 binary batch 的首子帧，确保后续 0x12 帧使用最新缓存）
        const refreshFrame = this._build_dirty_refresh_frame();
        this._dirty_players.clear();

        // 无内容可发送（batch 帧和 notify buffer 均为空）
        if (n === 0 && !refreshFrame) {
            // 仍需检查是否有玩家有待发送的 notify 文本帧
            const items0 = this.items;
            for (let i = 0; i < items0.length; i++) {
                const it: any = items0[i];
                if (it.is_player && it._notify_markers && it._notify_markers.length > 0) {
                    const frames = it._notify_frames;
                    const out: Buffer[] = [];
                    for (let k = 0; k < frames.length; k++) out.push(frames[k]);
                    it.socket?.write(Buffer.concat(out));
                    it._notify_markers.length = 0;
                    it._notify_frames.length = 0;
                }
            }
            return;
        }

        // 为每个玩家构建输出：按 _notify_markers 与 binary 子帧交错
        // marker = 入队时 _batch_all_payloads.length，表示该文本帧在 binary 序列中的位置
        const items = this.items;
        for (let i = 0; i < items.length; i++) {
            const item: any = items[i];
            if (!item.is_player || !item.socket) continue;
            // 跳过刚进房的玩家（他们已通过 items_to_json 收到完整列表，不应收到自己的 0x57 帧）
            // 同时清空可能残留的 notify 缓冲，避免 marker 跨 tick 引用已清空的 binary 序列导致越界
            if (skipSet && skipSet.has(item)) {
                item._notify_markers.length = 0;
                item._notify_frames.length = 0;
                continue;
            }

            const noCombat = hasCombat && item.query_setting('no_combatmsg');
            const markers = item._notify_markers;
            const frames = item._notify_frames;
            const output: Buffer[] = [];
            let binaryStart = 0;
            let refreshAttached = false;

            // 收集 payloads[binaryStart, endIdx) 内的 binary 子帧（按 noCombat 过滤）合并为单个 WS 帧
            const flushBinary = (endIdx: number) => {
                if (endIdx <= binaryStart) return;
                const batch: Buffer[] = [];
                for (let j = binaryStart; j < endIdx; j++) {
                    if (noCombat && combatFlags[j]) continue;
                    if (item.no_message && !combatFlags[j] && (payloads[j][0] & 0x7f) === 0x12) continue;
                    batch.push(payloads[j]);
                }
                binaryStart = endIdx;
                if (batch.length === 0) return;
                // refreshFrame 只附在首个实际输出的 binary batch 前
                const merged = _mergeBatchFrame(batch, !refreshAttached ? refreshFrame : null);
                refreshAttached = true;
                output.push(merged);
            };

            // 遍历该玩家的 notify 标记，按 marker 在 binary 序列中插入文本帧
            if (markers && markers.length > 0) {
                for (let j = 0; j < markers.length; j++) {
                    flushBinary(markers[j]);
                    output.push(frames[j]);
                }
                markers.length = 0;
                frames.length = 0;
            }
            flushBinary(n);

            // 无 binary 输出但有 refreshFrame（文本-only 玩家也需更新缓存）
            if (!refreshAttached && refreshFrame) {
                output.push(_mergeBatchFrame([], refreshFrame));
            }

            if (output.length > 0) {
                item.socket.write(Buffer.concat(output));
            }
        }
    }

    /**
     * 销毁房间(清空物品和所有者)
     * 销毁前 flush 所有玩家的 notify 缓冲，避免文本帧丢失
     */
    destroy(): void {
        // 兜底：flush 房内玩家的 notify 缓冲（正常路径由 replaceRoom 迁移，此处防御直接 destroy）
        const items = this.items;
        for (let i = 0; i < items.length; i++) {
            const it: any = items[i];
            if (it.is_player && it._notify_markers && it._notify_markers.length > 0 && it.socket) {
                const frames = it._notify_frames;
                const out: Buffer[] = [];
                for (let k = 0; k < frames.length; k++) out.push(frames[k]);
                it.socket.write(Buffer.concat(out));
                it._notify_markers.length = 0;
                it._notify_frames.length = 0;
            }
        }
        this.items.length = 0;
        this.owner = null;
    }

    /**
     * 房间心跳
     * @param dt
     */
    heart_beat(dt: number): void {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].check_player()) this.items[i].heart_beat?.(dt);
        }
        this.on_heart_beat?.(dt);
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
    query_fb_first(id: string): ROOM | undefined {
        if (!this.parent || !this.parent.is_copy || !this.parent.rooms) return;
        return this.parent.rooms[0].query_copy(id);
    }

    /**
     * 查询副本房间
     * @param id
     */
    query_copy(id: string): ROOM | undefined {
        if (!this.copy_rooms) this.copy_rooms = {};
        return this.copy_rooms[id];
    }

    /**
     * 根据用户查找对应副本
     * @param user
     */
    query_copy2(user: CHARACTER): ROOM | undefined {
        const id = this.parent?.query_owner(user);
        if (!id) return this;
        return this.query_copy(id);
    }

    /**
     * 清除副本区域
     * @param me
     */
    clear_copy(me: CHARACTER): void {
        if (!this.owner) return;
        const id = this.parent?.query_owner(me);
        if (id !== this.owner) return;
        const name = 'fb/';
        const toDelete: string[] = [];
        me.forEach_temp(key => {
            if (key.startsWith(name)) toDelete.push(key);
        });
        for (const key of toDelete) {
            me.remove_temp(key);
        }
        if (me.team) {
            for (let i = 0; i < me.team.length; i++) {
                const tm = me.team[i];
                if (
                    tm !== me &&
                    tm.environment &&
                    tm.environment.parent === this.parent &&
                    tm.environment.owner == this.owner
                ) {
                    return;
                }
            }
        }
        this.parent && this.clear_by_area(this.parent, this.owner);
    }

    /**
     * 为用户创建副本
     * @param me
     * @param diff_type - 难度
     */
    create_copy2(me: CHARACTER, diff_type?: number): ROOM | undefined {
        const id = this.parent?.query_owner(me);
        if (!id) return;
        return this.create_copy(id, diff_type || 0);
    }

    /**
     * 创建副本房间
     * @param id - 副本所有者ID
     * @param diff_type - 难度
     */
    create_copy(id: string, diff_type: number): ROOM | undefined {
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
    create_by_area(area: Record<string, any>, id: string, diff_type?: number): void {
        if (area.rooms) {
            for (let i = 0; i < area.rooms.length; i++) {
                const base_room = area.rooms[i];
                const copy_room = ROOM.CREATE(base_room.path);
                if (!copy_room) continue;
                if (diff_type !== undefined) copy_room.set_difficulty(diff_type);
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
    create_shadow(): ROOM | undefined {
        if (this.is_copy_room || this.no_shadow) return;

        if (!this.shadow_rooms) this.shadow_rooms = [];
        for (let i = 0; i < this.shadow_rooms.length; i++) {
            if (!this.shadow_rooms[i].is_full()) {
                return this.shadow_rooms[i];
            }
        }
        const shadow = ROOM.CREATE(this.path);
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
    clear_by_area(area: Record<string, any>, id: string): void {
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
     * 查询副本临时数据(按队伍隔离，委托给队长 USER 实例)
     */
    fb_query_temp(name: string, me: USER, def?: any): any {
        const first = this.query_fb_first(me.query_teamid());
        if (!first) return;
        return first.query_temp(name, def);
    }

    /**
     * 设置副本临时数据(按队伍隔离)
     */
    fb_set_temp(name: string, value: unknown, me: USER, time?: number): void {
        const first = this.query_fb_first(me.query_teamid());
        if (!first) return;
        first.set_temp(name, value, time);
    }

    /**
     * 累加副本临时数据(按队伍隔离)
     */
    fb_add_temp(name: string, value: number, me: USER, time?: number): number {
        const val = (this.fb_query_temp(name, me, 0) as number) + value;
        this.fb_set_temp(name, val, me, time);
        return val;
    }

    /**
     * 随机获取一个公共房间
     */
    static RANDOM(): ROOM | undefined {
        if (!this.public_rooms) {
            this.public_rooms = [];
            for (let i = 0; i < WORLD.AREAS.length; i++) {
                if (WORLD.AREAS[i].is_area && !WORLD.AREAS[i].is_public) {
                    const rms = WORLD.AREAS[i].rooms;

                    for (let j = 0; j < rms.length; j++) {
                        if (rms[j].max_item_count > 1) this.public_rooms.push(rms[j]);
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
            let item = this.items[i];
            if (item.check_player()) {
                item.send(msg);
            }
        }
    }

    /**
     * 查找房间中第一个玩家
     */
    find_me(): CHARACTER | undefined {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].is_player) {
                return this.items[i] as unknown as CHARACTER;
            }
        }
    }

    /**
     * 查询房间(考虑副本)
     * @param id - 房间路径
     */
    query(id: string): ROOM | undefined {
        const room = WORLD.getRoom(id);
        if (!room) return undefined;
        if (this.owner) {
            return room.query_copy(this.owner);
        }
        return room;
    }
}

const BATCH_MARKER = Buffer.from([0xFE]);


/**
 * 合并 batch payloads + refreshFrame 为单个 WebSocket 帧（单次分配）
 * 格式: [WS帧头][0xFE BATCH_MARKER][refreshFrame?][payload1][payload2]...
 * 替代 all.unshift + Buffer.concat + encodeBinaryFrame 的多次分配
 */
function _mergeBatchFrame(buffers: Buffer[], refreshFrame: Buffer | null): Buffer {
    // 计算总 payload 长度（BATCH_MARKER 1 字节 + refreshFrame + 各 payload）
    let payloadLen = 1;
    if (refreshFrame) payloadLen += refreshFrame.length;
    for (let i = 0; i < buffers.length; i++) payloadLen += buffers[i].length;

    // 计算 WebSocket 帧头长度（<126=2B, <65536=4B, 否则=10B）
    let headerLen: number;
    if (payloadLen < 126) headerLen = 2;
    else if (payloadLen < 65536) headerLen = 4;
    else headerLen = 10;

    // 一次性分配 WS 帧（帧头 + payload）
    const framed = Buffer.allocUnsafe(payloadLen + headerLen);
    // 写入 WebSocket 帧头（FIN=1, opcode=2 Binary，无 mask）
    framed[0] = 0x82;
    if (payloadLen < 126) {
        framed[1] = payloadLen;
    } else if (payloadLen < 65536) {
        framed[1] = 126;
        framed.writeUInt16BE(payloadLen, 2);
    } else {
        framed[1] = 127;
        framed.writeUInt32BE(0, 2);
        framed.writeUInt32BE(payloadLen, 6);
    }
    // 写入 payload：BATCH_MARKER + refreshFrame + 各 buffer
    let pos = headerLen;
    framed[pos++] = 0xFE;
    if (refreshFrame) {
        refreshFrame.copy(framed, pos);
        pos += refreshFrame.length;
    }
    for (let i = 0; i < buffers.length; i++) {
        buffers[i].copy(framed, pos);
        pos += buffers[i].length;
    }
    return framed;
}

// ============================================================
// 二进制 op 编码：0x57 房间人员增量 / 0x58 房间人员离开
// ============================================================

/** 编码无符号 varint (LEB128) */
function _encode_varint(value: number): Buffer {
    const bytes: number[] = [];
    let v = value >>> 0;
    while (v >= 0x80) { bytes.push((v & 0x7f) | 0x80); v >>>= 7; }
    bytes.push(v & 0x7f);
    return Buffer.from(bytes);
}

/** 方向字符串 → 索引映射（1-20，0=无方向） */
const DIR_INDEX: Record<string, number> = {
    north: 1, south: 2, east: 3, west: 4,
    northup: 5, southup: 6, eastup: 7, westup: 8,
    northdown: 9, southdown: 10, eastdown: 11, westdown: 12,
    northeast: 13, northwest: 14, southeast: 15, southwest: 16,
    up: 17, down: 18, enter: 19, out: 20,
};

/**
 * 编码 0x58 房间人员离开帧
 * 格式: [0x58][uid 7B][dir_index 1B][flags 1B][可选: 2B tpl_id]
 * dir_index: 0=无方向, 1-20=方向索引
 * flags: bit0=is_fighting, bit1=has_tpl_id
 * tpl_id: 2 字节模板 ID（pack --binary 转换后的数字，客户端用 obj.name 替换 $N）
 */
function _encode_item_leave_frame(obj: ITEM, dir?: string, isFighting?: boolean, tplId?: number): Buffer {
    const uid = obj._get_packed_id();
    const hasTplId = tplId !== undefined && tplId >= 0;
    const totalLen = hasTplId ? 12 : 10;
    const buf = Buffer.allocUnsafe(totalLen);
    buf[0] = 0x58;
    uid.copy(buf, 1);
    buf[8] = dir ? (DIR_INDEX[dir] || 0) : 0;
    let flags = 0;
    if (isFighting) flags |= 0x01;
    if (hasTplId) flags |= 0x02; // has_tpl_id
    buf[9] = flags;
    if (hasTplId) {
        // 提取 pure_id（与 0x12 帧一致：idMask 已在 pack 注册时决定 fieldMask，帧内只需 pure_id 供客户端查表）
        buf.writeUInt16BE(tplId! & 0xFFFF, 10);
    }
    return buf;
}

/**
 * 编码 0x57 房间人员增量帧 — 替代 itemadd JSON
 * 格式: [0x57][uid 7B][flags 1B][1B name_len][utf8 name][可选字段...][可选: 2B tpl_id]
 * flags: bit0=is_player, bit1=has_status, bit2=has_combat, bit3=has_status_effects, bit4=is_fighting, bit5=has_tpl_id
 * tpl_id: 2 字节模板 ID（pack --binary 转换后的数字，客户端用 obj.name 替换 $N）
 * 返回 null 表示无法二进制编码（回退到 JSON 路径）
 */
function _encode_item_add_frame(obj: ITEM, isFighting?: boolean, tplId?: number): Buffer | null {
    const uid = obj._get_packed_id();
    const nameBuf = Buffer.from(obj.long_name(), 'utf8');
    if (nameBuf.length > 255) return null; // 1B 长度限制

    let flags = 0;
    const parts: Buffer[] = [];

    // name — 必有
    const nameHdr = Buffer.allocUnsafe(1);
    nameHdr[0] = nameBuf.length;
    parts.push(nameHdr, nameBuf);

    if (obj.is_player) flags |= 0x01;

    if (obj.check_character()) {
        const ch = obj as CHARACTER;
        flags |= 0x02; // has_status
        flags |= 0x04; // has_combat

        // status: 4×varint (mp, hp, max_mp, max_hp)
        parts.push(_encode_varint(ch.mp));
        parts.push(_encode_varint(ch.hp));
        parts.push(_encode_varint(ch.max_mp));
        parts.push(_encode_varint(ch.max_hp));

        // combat: w, c, th, n (各 1B len + utf8)
        for (const s of [ch.weapon_name() || '', ch.call3(), ch.throwing_name() || '', ch.name]) {
            const b = Buffer.from(s, 'utf8');
            if (b.length > 255) return null;
            const hdr = Buffer.allocUnsafe(1);
            hdr[0] = b.length;
            parts.push(hdr, b);
        }

        // status_effects (append_status)
        if (ch.status && ch.status.length > 0) {
            flags |= 0x08; // has_status_effects
            const statusStrs: string[] = [];
            ch.append_status(statusStrs);
            let statusJson = statusStrs.join('');
            if (statusJson.startsWith(',')) statusJson = statusJson.slice(1); // 去掉前导逗号
            const statusBuf = Buffer.from(statusJson, 'utf8');
            parts.push(_encode_varint(statusBuf.length), statusBuf);
        }

        // profile: per(1B) + gender(1B) + has_cloth(1B) — 客户端用于生成面容/武器/衣着进入消息
        flags |= 0x40; // has_profile
        const profBuf = Buffer.allocUnsafe(3);
        profBuf[0] = Math.min(255, ch.per | 0);
        profBuf[1] = ch.gender | 0;
        profBuf[2] = (ch.equipment && ch.equipment[1]) ? 1 : 0; // EQUIP_TYPE.CLOTH = 1
        parts.push(profBuf);
    }

    if (isFighting) flags |= 0x10; // is_fighting

    // 模板 ID（2B，与 0x12 帧一致，客户端查找模板表并用 obj.name 替换 $N）
    const hasTplId = tplId !== undefined && tplId >= 0;
    if (hasTplId) {
        flags |= 0x20; // has_tpl_id
        const tplIdBuf = Buffer.allocUnsafe(2);
        tplIdBuf.writeUInt16BE(tplId! & 0xFFFF, 0); // pure_id（与 0x12 帧一致）
        parts.push(tplIdBuf);
    }

    // 组装
    let totalLen = 1 + 7 + 1; // op + uid + flags
    for (const p of parts) totalLen += p.length;
    const buf = Buffer.allocUnsafe(totalLen);
    let offset = 0;
    buf[offset++] = 0x57;
    uid.copy(buf, offset); offset += 7;
    buf[offset++] = flags;
    for (const p of parts) { p.copy(buf, offset); offset += p.length; }
    return buf;
}


declare global {
    var ROOM: any;
}

globalThis.ROOM = ROOM;
