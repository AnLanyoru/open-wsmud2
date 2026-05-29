/**
 * AREA 区域类 - 管理一组房间
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { FAMILIES } from "../skill/family.js";
import { NPC } from "../char/npc.js";

export class AREA extends BASE {

    static __initInstance(obj) {
        obj.rooms = [];
        obj.map = [];
        obj.name = "";
        obj.is_area = false;
        obj.first = null;
        obj.is_show = true;
        obj.is_copy = false;
        obj.expend = 10;
        obj.is_multi = false;
        obj.index = 0;
        obj.exp = 1000;
        obj.pot = 1000;
    }

    // ============ 核心属性 ============

    /** @type {string} 区域名称 */
    name = "";
    /** @type {string} 区域ID */
    id;
    /** @type {string} 区域描述 */
    desc;
    /** @type {boolean} 是否为区域 */
    is_area = false;
    /** @type {boolean} 是否在小地图显示 */
    is_show = true;

    // ============ 房间管理 ============

    /** @type {ROOM[]} 区域内的房间列表 */
    rooms = [];
    /** @type {Array} 小地图数据 */
    map = [];
    /** @type {string|null} 默认入口房间路径 */
    first = null;

    // ============ 副本相关 ============

    /** @type {boolean} 是否为副本区域 */
    is_copy = false;
    /** @type {boolean} 是否支持多人副本 */
    is_multi = false;
    /** @type {number} 副本消耗(体力/令牌等) */
    expend = 10;
    /** @type {number} 副本索引 */
    index = 0;
    /** @type {number} 副本基础经验 */
    exp = 1000;
    /** @type {number} 副本基础潜能 */
    pot = 1000;
    /** @type {boolean} 是否非副本(普通区域标识) */
    not_fb = false;
    /** @type {string|null} 重生房间路径 */
    recover_room = null;

    // ============ 掉落相关 ============

    /** @type {Array|null} 掉落列表缓存 */
    drop_list = null;
    /** @type {Array|null} 困难模式掉落列表缓存 */
    diff_drop_list = null;
    /** @type {Array|null} 普通模式NPC掉落配置 */
    drop_npcs0 = null;
    /** @type {Array|null} 困难模式NPC掉落配置 */
    drop_npcs1 = null;

    // ============ 门派与社交 ============

    /** @type {string|null} 所属门派标识 */
    family = null;
    /** @type {boolean} 是否为公共区域 */
    is_public = false;

    // ============ 缓存 ============

    /** @type {Object|null} JSON缓存 */
    json = null;
    /** @type {string|null} 所属区域路径(用于快速查找) */
    room_path = null;
    /** @type {number} 副本难度系数 */
    fb_index = 1;

    // ============ 回调函数(由资源文件设置) ============

    /** @type {Function|null} 登录回调 */
    on_login = null;
    /** @type {Function|null} 离开回调 */
    on_leave = null;

    constructor() {
        super();
        AREA.__initInstance(this);
    }

    /**
     * 区域创建回调
     * @param {string} path
     */
    create(path) {
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
    static Get(id) {
        if (!WORLD.AREAS) return;
        for (let i = 0; i < WORLD.AREAS.length; i++) {
            if (WORLD.AREAS[i].id == id) return WORLD.AREAS[i];
        }
    }

    /**
     * 玩家离开区域回调
     * @param {USER} me
     */
    on_leaved(me) {
    }

    /**
     * 玩家离开前回调
     * @param {USER} me
     * @returns {boolean}
     */
    on_leave(me) {
        return true;
    }

    /**
     * 玩家进入后回调
     * @param {USER} me
     */
    on_enterd(me) {
    }

    /**
     * 玩家进入前回调
     * @param {USER} me
     * @returns {boolean}
     */
    on_enter(me) {
        return true;
    }

    /**
     * 查找子区域
     * @param {string} path
     * @returns {void}
     */
    find_area(path) {
    }

    /**
     * 查询指定难度的通关记录
     * @param {number} diff
     * @returns {*}
     */
    is_record(diff) {
        return this["record_" + diff];
    }

    /**
     * 查询区域经验奖励
     * @returns {number}
     */
    query_exp() {
        const lv = this.fb_index || 0;
        return 1000 + lv * 100;
    }

    /**
     * 查询区域描述
     * @returns {string}
     */
    query_desc() {
        return this.desc;
    }

    /**
     * 清除缓存(重置json和掉落列表)
     * @returns {void}
     */
    clear() {
        this.json = null;
        this.drop_list = null;
        this.diff_drop_list = null;
    }

    /**
     * 查询普通掉落列表
     * @param {boolean} [isdiff]
     * @returns {Array<*>}
     */
    query_drops(isdiff) {
        if (isdiff) return this.query_diff_drops();
        if (this.drop_list) return this.drop_list;
        const items = [];
        for (let i = 0; i < this.rooms.length; i++) {
            const rm = this.rooms[i];
            for (let j = 0; j < rm.items.length; j++) {
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
    query_npc_drops(npcs, items) {
        if (!npcs || !npcs.length) return;
        for (let i = 0; i < npcs.length; i++) {
            const npc = NPC.GET(npcs[i]);
            if (!npc || !npc.drop_list) continue;
            items.push(npc.drop_list)
        }
    }

    /**
     * 查询困难模式掉落
     * @param {boolean} [isdiff]
     * @returns {Array<*>}
     */
    query_diff_drops(isdiff) {
        if (this.diff_drop_list) return this.diff_drop_list;
        const items = [];
        for (let i = 0; i < this.rooms.length; i++) {
            const rm = this.rooms[i];
            for (let j = 0; j < rm.items.length; j++) {
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
    update(path) {
        WORLD.COMMANDS["jh"].map_json = null;
        for (let i = 0; i < WORLD.AREAS.length; i++) {
            if (WORLD.AREAS[i].path == path) {
                const old_area = WORLD.AREAS[i];
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
    query_drop_items() {
        return this.drop_items;
    }

    /**
     * 查询区域命令
     * @returns {*}
     */
    query_actions() {
        return this.actions;
    }
}
globalThis.AREA = AREA;
