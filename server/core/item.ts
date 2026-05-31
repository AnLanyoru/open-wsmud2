// ============================================================
// ITEM — 所有游戏物件的基类（物品、角色、房间等）
// ============================================================

import { BASE } from './base.js';

import { UTIL } from './util.js';

import type { ROOM } from './room/room.js';
import type { ActionDef, ActionMap } from '../types/base.js';

// ============================================================
// ITEM 类
// ============================================================

export class ITEM extends BASE {

    constructor() {
        super();
    }

    // ============ 核心标识属性 ============

    /** 物件路径标识 */
    path!: string;
    /** 物件唯一 ID */
    id!: string;
    /** 物件唯一 UID */
    uid!: string;
    /** 物件名称 */
    name!: string;

    // ============ 容器相关属性 ============

    /** 最大携带物品数 */
    max_item_count: number = 10;
    /** 金钱数量 */
    money: number = 0;
    /** 子物品列表 */
    items: ITEM[] | null = null;
    /** 是否为货币 */
    is_money: boolean = false;
    /** 物品价值（单价） */
    value: number = 0;
    /** 物品数量 */
    count: number = 1;
    /** 是否可堆叠 */
    combined: boolean = false;

    // ============ 交互相关属性 ============

    /** 可执行命令映射 */
    actions: ActionMap<this> = null;
    /** JSON 缓存 */
    json: string | null = null;

    // ============ 公共属性（CHARACTER / OBJ / ROOM 等共有） ============

    /** 描述文本 */
    desc: string = '';
    /** 带颜色的名称缓存 */
    color_name: string = '';
    /** 临时数据 */
    temp: Record<string, any> | null = null;
    /** 是否为玩家 */
    is_player: boolean = false;
    /** 是否静默消息 */
    no_message: boolean = false;
    /** 属性加成映射 */
    prop: Record<string, number> | null = null;
    /** 是否为容器 */
    is_container: boolean = false;
    /** 是否为角色 */
    is_character: boolean = false;
    /** 是否禁止拾取 */
    no_get: boolean = false;
    /** 是否为 NPC */
    is_npc: boolean = false;
    /** 当前所在环境（房间） */
    environment: ROOM | null = null;
    /** 掉落列表 */
    drop_list: any[] | null = null;

    // ============ 子类共享属性（OBJ / EQUIPMENT 等） ============

    /** 是否为装备 */
    is_equipment: boolean = false;
    /** 单位名称 */
    unit: string = '个';
    /** 品级 */
    grade: number = 0;
    /** 物件类型标识 */
    otype: number = 0;

    // ============ 消息发送（桩方法，由 CHARACTER 覆写） ============

    /** 发送消息到客户端（桩方法，玩家/NPC 子类覆写） */
    send(_msg: string): void {}
    /** 查询用户设置（桩方法，玩家子类覆写） */
    query_setting(_name: string): boolean | number { return false; }

    // ============ 堆叠操作 ============

    /**
     * 合并物品 — 相同物品合并 count 和 temp
     * @param obj - 要合并的物品
     */
    combine(obj: ITEM): void {
        return undefined;
    }

    /**
     * 拆分堆叠 — 分出 count 个返回新物品
     * @param count - 拆分数量
     * @returns 拆分出的物品（或 this 表示不拆分）
     */
    uncombine(count: number): ITEM {
        return this;
    }

    // ============ 临时数据存储 ============

    /**
     * 查询临时数据
     * @param name - 键名
     * @param def - 默认值
     * @param _me - 玩家（ROOM 子类用于按人隔离数据）
     */
    query_temp<T = unknown>(name: string, def?: T, _me?: unknown): T | undefined {
        if (!this.temp) return def;
        const item = this.temp[name];
        if (item && item.e) {
            if (Date.now() <= item.e) {
                return item.v;
            }
            this.temp[name] = null;
            return def;
        }
        return item ?? def;
    }

    /**
     * 设置临时数据
     * @param name - 键名
     * @param value - 值
     * @param time - 有效期（毫秒）
     * @param _me - 玩家（ROOM 子类用于按人隔离数据）
     */
    set_temp(name: string, value: unknown, time?: number, _me?: unknown): void {
        if (!this.temp) this.temp = {};
        if (time) {
            this.temp[name] = {
                v: value,
                e: Date.now() + time,
            };
        } else {
            this.temp[name] = value;
        }
    }

    /**
     * 移除临时数据
     * @param name - 键名
     */
    remove_temp(name: string): void {
        if (!this.temp) return;
        this.temp[name] = null;
    }

    /**
     * 累加临时数据
     * @param name - 键名
     * @param value - 累加值
     * @param time - 有效期
     * @param _me - 玩家（ROOM 子类用于按人隔离数据）
     * @returns 累加后的值
     */
    add_temp(name: string, value: number, time?: number, _me?: unknown): number {
        const val = (this.query_temp(name, 0, _me) as number) + value;
        this.set_temp(name, val, time, _me);
        return val;
    }

    // ============ 生命周期 ============

    /**
     * 通知消息 — CHARACTER 覆写，ROOM 遍历 items 调用
     * @param msg - 消息内容
     */
    notify(msg: string): void {
        return undefined;
    }

    /**
     * 心跳处理
     * @param dt - 当前时间戳
     */
    heart_beat(dt: number): void {
        return undefined;
    }

    /**
     * 初始化 — 子类可覆写
     * @param _args - 参数列表
     */
    init(..._args: unknown[]): void {
        return undefined;
    }

    // ============ 命令系统 ============

    /**
     * 添加物件可以接收的命令（目标为当前对象的）
     * @param cmd - 命令名
     * @param name - 显示名称
     * @param func - 执行函数
     * @returns 动作定义
     */
    add_action(
        cmd: string,
        name: string,
        func: (this: this, ...args: unknown[]) => unknown,
    ): ActionDef<this> | undefined {
        if (!cmd) return;
        if (!this.actions) this.actions = {};
        let act = this.actions[cmd];
        if (act) {
            if (!name) {
                act.action = func;
            } else {
                act.name = name;
            }
            if (!func) {
                act.name = name;
            } else {
                act.action = func;
            }
        } else {
            act = {
                name: name,
                action: func,
            };
            this.actions[cmd] = act;
        }
        this.json = null;
        return act;
    }

    /**
     * 移除物件可以接收的命令
     * @param name - 命令名或命令名数组
     * @param _func - （保留参数，未使用）
     */
    remove_action(name: string | string[], _func?: Function): void {
        if (!this.actions) this.actions = {};
        if (typeof name === 'string') {
            delete this.actions[name];
        } else {
            for (let i = 0; i < name.length; i++) {
                delete this.actions[name[i]];
            }
        }
        this.json = null;
    }

    /**
     * 执行命令 — 返回 true 表示已处理
     * @param cmdName - 命令名
     * @param pars - 参数列表
     */
    exec(cmdName: string, pars: unknown[]): unknown {
        if (this.actions) {
            const cmd = this.actions[cmdName];
            if (cmd && cmd.action) {
                return cmd.action.apply(this, pars);
            }
        }
        return false;
    }

    // ============ 物品管理 ============

    /**
     * 获取当前携带物品数量
     */
    item_count(): number {
        return this.items ? this.items.length : 0;
    }

    /**
     * 判断背包是否已满
     * @param val - 要添加的数量，不传则判断是否已达上限
     */
    is_full(val?: number): boolean {
        if (!this.items) return false;
        if (val) return this.items.length + val > this.max_item_count;
        return this.items.length >= this.max_item_count;
    }

    /**
     * 根据 ID 查找物品
     * @param id - 物品 ID
     * @returns 物品对象或 null
     */
    find_obj(id: string): ITEM | null {
        return null;
    }

    /**
     * 根据路径查找子物品
     * @param path - 物品路径
     * @param parent - 父容器，默认 this
     */
    find_obj_bypath(path: string, parent?: ITEM): ITEM | undefined {
        parent = parent || this;
        if (!parent.items) return;
        for (let i = 0; i < parent.items.length; i++) {
            if (parent.items[i].path === path) {
                return parent.items[i];
            }
        }
        return;
    }

    /**
     * 遍历子物品
     * @param func - 回调，返回 false 停止遍历
     * @param parent - 父容器，默认 this
     */
    each_item(func: (item: ITEM) => boolean | void, parent?: ITEM): void {
        if (!func) return;
        parent = parent || this;
        if (!parent.items) return;
        const l = parent.items.length;
        for (let i = 0; i < l; i++) {
            const item = parent.items[i];
            if (!item) continue;
            if (func(item) === false) return;
        }
    }

    /**
     * 判断是否等于某物品
     * @param obj - 物品对象或路径
     */
    is(obj: ITEM | string | null | undefined): boolean {
        if (!obj) return false;
        if (typeof obj === 'string') return this.path === obj;
        return this.path === obj.path;
    }

    /**
     * 根据 ID 移除物品
     * @param obj - 物品 ID
     * @param count - 拆分数量
     * @returns 移除的物品
     */
    remove_item_byid(obj: string, count: number = 0): ITEM | null | undefined {
        if (!obj || !this.items) return;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.id === obj) {
                if (item.combined && count > 0) {
                    const subitem = item.uncombine(count);
                    if (!subitem) return;
                    if (subitem === item) {
                        this.items.splice(i, 1);
                    }
                    return subitem;
                } else {
                    this.items.splice(i, 1);
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * 根据物品引用移除物品
     * @param obj - 物品对象
     * @param count - 拆分数量
     * @returns 移除的物品
     */
    remove_item(obj: ITEM, count: number = 0): ITEM | null | undefined {
        if (!obj || !this.items) return;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item === obj) {
                if (item.combined) {
                    const subitem = item.uncombine(count);
                    if (!subitem) return;
                    if (subitem === item) {
                        this.items.splice(i, 1);
                    }
                    return subitem;
                } else {
                    this.items.splice(i, 1);
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * 移动物品到目标容器
     * @param obj - 要移动的物品
     * @param count - 数量
     * @param target - 目标容器
     * @returns 移动后的物品
     */
    move_item_to(obj: ITEM, count: number, target: ITEM): ITEM | undefined {
        if (!obj || !this.items) return;
        const movedObj = this.remove_item(obj, count);
        if (!target) return;
        return target.push_item(movedObj);
    }

    /**
     * 接收物品并入容器
     * @param movedObj - 要加入的物品
     * @returns 入包后的物品
     */
    push_item(movedObj: ITEM | null | undefined): ITEM | undefined {
        if (!movedObj) return;
        if (!this.items) this.items = [];
        if (movedObj.is_money && this.money !== undefined) {
            this.money += movedObj.value * movedObj.count;
        } else if (movedObj.combined) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].is(movedObj)) {
                    this.items[i].combine(movedObj);
                    return this.items[i];
                }
            }
            this.items.push(movedObj);
        } else {
            this.items.push(movedObj);
        }
        return movedObj;
    }

    // ============ ID / 缓存 ============

    /**
     * 创建对象 ID
     */
    create_id(): void {
        this.id = (UTIL as { create_id(): string }).create_id();
    }

    /**
     * 刷新缓存
     */
    refresh(): void {
        this.json = null;
    }

    /**
     * 是否隐藏
     */
    is_hidden(): boolean {
        return false;
    }

    /**
     * 查询创建时间
     */
    query_create_time(): Date | undefined {
        const id = this.id;
        if (!id) return;
        const time = parseInt(id.substr(4), 16);
        return new Date(time * 1000 + (UTIL as { begin: number }).begin);
    }

    /**
     * 在指定数组中根据 ID 查找物品
     * @param items - 物品数组
     * @param oid - 物品 ID
     */
    find_obj_byid(items: ITEM[], oid: string): ITEM | undefined {
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === oid) {
                return items[i];
            }
        }
        return;
    }

    // ============ 显示名称 ============

    /**
     * 完整显示名称 — getter，子类可覆写
     */
    long_name(): string {
        return this.name;
    }

    // ============ 生命周期回调 ============

    /**
     * 对象创建回调
     * @param file - 文件名
     * @param ctor - 构造参数
     */
    create(file: string, ctor?: string): void {
        this.uid = this.create_uid();
    }

    /**
     * 销毁对象
     */
    destroy(): void {
        return undefined;
    }

    // ============ 临时数据序列化 ============

    /**
     * 格式化临时数据为 JSON 字符串
     * @param temp - 临时数据
     * @param timeout - 过期时限（毫秒），默认 120000
     * @returns JSON 字符串
     */
    format_temp(temp: Record<string, any> | null | undefined, timeout: number = 120000): string {
        if (!temp) return '{}';
        const dt = Date.now() + timeout;
        const tmp: string[] = ['{'];
        for (const key in temp) {
            const v = temp[key];
            if (!v) continue;
            if (v.e) {
                if (dt > v.e || !v.v) continue;
                if (tmp.length > 1) tmp.push(',');
                tmp.push('"');
                tmp.push(key);
                tmp.push('":{e:');
                tmp.push(v.e);
                tmp.push(',v:');
                if (typeof v.v === 'string') {
                    tmp.push('"');
                    tmp.push(v.v);
                    tmp.push('"');
                } else {
                    tmp.push(v.v);
                }
                tmp.push('}');
            } else {
                if (tmp.length > 1) tmp.push(',');
                tmp.push('"');
                tmp.push(key);
                tmp.push('":');
                if (typeof v === 'string') {
                    tmp.push('"');
                    tmp.push(v);
                    tmp.push('"');
                } else {
                    tmp.push(v);
                }
            }
        }
        tmp.push('}');
        return tmp.join('');
    }
}
