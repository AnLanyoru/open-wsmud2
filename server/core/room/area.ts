/**
 * AREA 区域类 - 管理一组房间
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { FAMILIES } from "../skill/family.js";
import { NPC } from "../char/npc.js";
import type { ROOM } from "./room.js";
import type { USER } from "../char/user.js";
import type { CHARACTER } from "../char/character.js";

// 延迟加载 ROOM 避免循环依赖: area.ts → room.ts → area.ts
let _ROOM: {
    Get: (path: string) => any;
} | null = null;
import("./room.js").then((m: Record<string, unknown>) => { _ROOM = m.ROOM as any; });

export class AREA extends BASE {

    // ============ 核心属性 ============

    /** 区域名称 */
    name: string = "";
    /** 区域ID */
    id: string = "";
    /** 区域描述 */
    desc: string = "";
    /** 是否为区域 */
    is_area: boolean = false;
    /** 是否在小地图显示 */
    is_show: boolean = true;

    // ============ 房间管理 ============

    /** 区域内的房间列表 */
    rooms: ROOM[] = [];
    /** 子区域列表(由extends设置) */
    areas: AREA[] | null = null;
    /** 小地图数据 */
    map: unknown[] = [];
    /** 默认入口房间路径 */
    first: string | null = null;

    // ============ 副本相关 ============

    /** 是否为副本区域 */
    is_copy: boolean = false;
    /** 是否支持多人副本 */
    is_multi: boolean = false;
    /** 副本消耗(体力/令牌等) */
    expend: number = 10;
    /** 副本索引 */
    index: number = 0;
    /** 副本基础经验 */
    exp: number = 1000;
    /** 副本基础潜能 */
    pot: number = 1000;
    /** 是否非副本(普通区域标识) */
    not_fb: boolean = false;
    /** 重生房间路径 */
    recover_room: string | null = null;

    // ============ 掉落相关 ============

    /** 掉落列表缓存 */
    drop_list: unknown[] | null = null;
    /** 困难模式掉落列表缓存 */
    diff_drop_list: unknown[] | null = null;
    /** 普通模式NPC掉落配置 */
    drop_npcs0: unknown[] | null = null;
    /** 困难模式NPC掉落配置 */
    drop_npcs1: unknown[] | null = null;

    // ============ 门派与社交 ============

    /** 所属门派标识 */
    family: string | null = null;
    /** 是否为公共区域 */
    is_public: boolean = false;

    // ============ 缓存 ============

    /** JSON缓存 */
    json: string | null = null;
    /** 所属区域路径(用于快速查找) */
    room_path: string | null = null;
    /** 副本难度系数 */
    fb_index: number = 1;

    // ============ 交互属性 ============

    /** 区域级命令映射 */
    actions: Record<string, unknown> | null = null;
    /** 区域掉落物品列表 */
    drop_items: unknown[] | null = null;

    // ============ 动态属性(由资源文件设置) ============

    /** 进阶难度索引 */
    jd_index?: number;
    /** 解锁关卡索引 */
    unlock_index?: number;

    // ============ 回调（由资源文件设置） ============

    /** 玩家登录回调 — 触发时机：玩家登录游戏进入该区域时 */
    on_login?: (user: USER) => void;
    /** 人物进入后回调 — 触发时机：人物首次进入该区域房间后 */
    on_enterd?: (me: CHARACTER) => void;

    constructor() {
        super();
    }

    /**
     * 区域创建回调
     * @param path
     */
    create(path: string): void {
        WORLD.AREAS.push(this);
        if (this.family) {
            FAMILIES[this.family].area = this;
        }
    }

    /**
     * 根据ID获取区域
     * @param id
     */
    static Get(id: string): AREA | undefined {
        if (!WORLD.AREAS) return;
        for (let i = 0; i < WORLD.AREAS.length; i++) {
            if (WORLD.AREAS[i].id == id) return WORLD.AREAS[i];
        }
    }

    /**
     * 人物离开区域回调
     * @param me
     */
    on_leaved(me: CHARACTER): void { return undefined; }

    /**
     * 人物离开前回调
     * @param me
     */
    on_leave(me: CHARACTER): boolean {
        return true;
    }

    /**
     * 人物进入后回调
     * @param me
     */
    on_enter(me: CHARACTER): boolean {
        return true;
    }

    /**
     * 查找子区域
     * @param path
     */
    find_area(path: string): AREA | undefined { return undefined; }

    /**
     * 查询指定难度的通关记录 是否通关
     * @param diff
     */
    is_record(diff: number): boolean {
        return this["record_" + diff];
    }

    /**
     * 查询区域经验奖励
     */
    query_exp(): number {
        const lv = this.fb_index || 0;
        return 1000 + lv * 100;
    }

    /**
     * 查询区域描述
     */
    query_desc(): string {
        return this.desc;
    }

    /**
     * 清除缓存(重置json和掉落列表)
     */
    clear(): void {
        this.json = null;
        this.drop_list = null;
        this.diff_drop_list = null;
    }

    /**
     * 查询普通掉落列表
     * @param isdiff
     */
    query_drops(isdiff?: boolean): unknown[] | null {
        if (isdiff) return this.query_diff_drops();
        if (this.drop_list) return this.drop_list;
        const items: any[] = [];
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
     * @param npcs
     * @param items
     */
    query_npc_drops(npcs: unknown[] | null, items: unknown[]): void {
        if (!npcs || !npcs.length) return;
        for (let i = 0; i < npcs.length; i++) {
            const npc = NPC.GET(npcs[i] as string);
            if (!npc || !npc.drop_list) continue;
            items.push(npc.drop_list);
        }
    }

    /**
     * 查询困难模式掉落
     */
    query_diff_drops(): unknown[] | null {
        if (this.diff_drop_list) return this.diff_drop_list;
        const items: any[] = [];
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
     * @param path
     */
    update(path: string): void {
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
                old_area.rooms = [];
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
     */
    query_drop_items(): unknown[] | null {
        return this.drop_items;
    }

    /**
     * 查询区域命令
     */
    query_actions(me?: any): any {
        return this.actions;
    }

    // ============ 区域扩展(由extends合并) ============

    /** 通知区域更新 */
    notify_update(): void {
        this.json = null;
        if (this.is_area)
            WORLD.send(`{type:"dialog",dialog:"jh",t:"fam",refresh:${this.index}}`);
        else
            WORLD.send(`{type:"dialog",dialog:"jh",t:"fb",refresh:${this.fb_index}}`);
    }

    /** @param me */
    query_owner(me: { query_teamid(): string }): string {
        return me.query_teamid();
    }

    /** @param me */
    clear_copy(me: USER): void {
        if (!_ROOM) return;
        const room = _ROOM.Get(this.first!)?.query_copy2(me);
        if (room)
            room.clear_copy(me);
    }

    /** @param me */
    is_unlock(me: USER): boolean {
        if ((this as { jd_index?: number }).jd_index! >= 0)
            return me.isenable_area(this);
        return ((this as { unlock_index?: number }).unlock_index ?? this.fb_index) <= me.query_temp("fb", 0)!;
    }
}
