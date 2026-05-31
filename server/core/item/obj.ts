/**
 * OBJ 普通物品基类
 *
 * Callbacks (set by resource files or overridden by subclasses):
 * - on_use(me, par?)      使用回调
 * - on_study(me, skill, lv)  修炼回调
 * - on_open(me)           打开回调
 * - on_init(me)           初始化回调
 * - on_create(path?, par?)  创建后回调
 * - on_reload(me)         热重载回调
 */
import { BASE } from '../base.js';
import { ITEM } from '../item.js';
import { UTIL } from '../util.js';
import type { CHARACTER } from '../char/character.js';
import type { SKILL } from '../skill/skill.js';

// Lazy import WORLD to avoid circular deps: obj.ts -> world.ts -> ... -> obj.ts
import type { IWorld } from '../../types/world.js';
let _WORLD: IWorld | null = null;
import('../world.js').then(m => {
    _WORLD = (m as { WORLD: IWorld }).WORLD;
});

/** __PATH global set at engine boot */
declare var __PATH: Record<string, string>;

/** Grade color tags */
const grade_color: string[] = ["wht", "hig", "hic", "hiy", "HIZ", "hio", "ord"];

/** 掉落概率条目（用于 create_by_odds 随机掉落系统） */
export interface OddsEntry {
    /** 掉落概率（万分比，默认 10000 即 100%） */
    odds?: number;
    /** 命中时掉落的物品路径（或路径数组，随机取一） */
    obj?: string | string[];
    /** 未命中时的保底物品路径 */
    fall_obj?: string;
    /** 固定数量（与 min/max 互斥） */
    count?: number;
    /** 随机数量最小值 */
    min?: number;
    /** 随机数量最大值 */
    max?: number;
}

// @ts-ignore: static CREATE override incompatible with base
export class OBJ extends ITEM {

    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** 单位名称（个/把/件 等） */
    unit: string = "个";
    /** 物品路径标识 */
    path: string = '';
    /** 物品数量 */
    count: number = 1;
    /** 是否可堆叠 */
    combined: boolean = true;
    /** 品级（0-6） */
    grade: number = 0;
    /** 物件类型标识 */
    otype: number = 0;
    /** 是否可交易 */
    transable: boolean = false;

    // ============ 显示属性 ============

    /** 带颜色标签的显示名称 */
    color_name: string = "";
    /** 物品描述 */
    desc: string = "";
    /** 物品价值 */
    value: number = 0;
    /** 是否为货币 */
    is_money: boolean = false;
    /** 是否为装备 */
    is_equipment: boolean = false;
    /** 显示快捷操作按钮 */
    showAction: boolean = false;
    /** 使用冷却时间（毫秒） */
    distime: number = 0;

    // ============ 功能属性 ============

    /** JSON 描述缓存 */
    json: string | null = null;
    /** 临时数据 */
    temp: Record<string, any> | null = null;
    /** 最大堆叠数量 */
    combine_count: number = 999;
    /** 是否已锁定 */
    is_locked: boolean = false;
    /** 是否快捷栏物品 — EQUIPMENT 专用 */
    is_shortcut: boolean = false;
    /** 装备槽位类型 — EQUIPMENT 专用 */
    eq_type: number = 0;
    /** 是否为容器 — CONTAINER/CORPSE 专用 */
    is_container: boolean = false;
    /** 容器是否已打开 — CONTAINER/CORPSE 专用 */
    is_open: boolean = false;

    // ============ 回调函数（由资源文件或子类设置） ============

    /** 使用回调，par 为可选参数 */
    on_use?(me: CHARACTER, par?: string): boolean | void;
    /** 学习回调，skill 为技能对象，lv 为技能等级 */
    on_study?(me: CHARACTER, skill: SKILL, lv: number): boolean | void;
    /** 打开回调，返回 false 阻止打开，返回数组表示打开后显示物品 */
    on_open?(me: CHARACTER): OBJ[] | false | void;
    /** 初始化回调 */
    on_init?(me: CHARACTER): void;
    /** 创建后回调 */
    on_create?(path?: string, par?: string): void;
    /** 热重载回调 */
    on_reload?(me: CHARACTER): void;
    /** 拾取回调，返回 false 阻止拾取 */
    on_get?(player: CHARACTER): boolean | void;

    /**
     * 初始化钩子
     * @param args - 参数列表
     */
    init(...args: any[]): void {
        const me = args[0] as CHARACTER | undefined;
        if (me && this.on_init) this.on_init(me);
    }

    /**
     * 完整显示名称（含数量前缀）
     */
    long_name(): string {
        if (this.combined) return UTIL.to_c(this.count) + this.unit + this.color_name;
        return this.color_name;
    }

    /**
     * 带可选数量的单位名称
     * @param count - 数量（默认使用自身 count）
     */
    unit_name(count?: number): string {
        return UTIL.to_c(count ?? this.count) + this.unit + this.color_name;
    }

    /**
     * 物品 JSON 序列化
     */
    item_to_json(): string {
        return `["${this.name}","${this.id}",${this.count},${this.grade},"${this.unit}",${parseInt(String(this.value / 10), 10)},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0}]`;
    }

    /**
     * 查询物品可执行命令
     * @param me - 查看的角色
     */
    query_commands(me: CHARACTER): string {
        return this.query_desc(me);
    }

    /**
     * 查询描述 JSON
     * @param me - 查看的角色
     */
    query_desc(me: CHARACTER): string {
        if (this.json) return this.json;
        const obj: Record<string, any> = {};
        obj.type = "item";
        obj.id = this.id;
        obj.desc = this.get_desc(me);
        obj.commands = [];
        obj.commands.push({
            cmd: "get " + this.id,
            name: "捡起"
        });
        this.json = JSON.stringify(obj);
        return this.json;
    }

    /**
     * 获取描述文本 — CONTAINER/EQUIPMENT/CORPSE 会覆写
     * @param me - 查看的角色
     */
    get_desc(me?: CHARACTER): string {
        return this.color_name + "\n" + this.desc;
    }

    /**
     * 拆分堆叠物品
     * @param spcount - 拆分数量
     * @returns 拆分出的新物品，无需拆分返回 this，无效则返回 undefined
     */
    uncombine(spcount?: number): ITEM {
        if (!spcount || spcount === this.count) return this;
        if (spcount < this.count) {
            const item = this.clone();
            item.count = spcount;
            this.count -= spcount;
            return item;
        }
        return undefined as unknown as ITEM;
    }

    /**
     * 克隆此物品
     * @param me - 可选，用于触发 on_reload 回调
     */
    clone(me?: CHARACTER): OBJ {
        const item = OBJ.CREATE(this.path!);
        if (this.temp) {
            item.temp = Object.assign({}, this.temp);
        }
        return item;
    }

    /**
     * 合并临时属性（取最大值）
     * @param target - 目标属性集
     * @param source - 来源属性集
     */
    combineTemp(target: Record<string, number> | null | undefined, source: Record<string, number> | null | undefined): Record<string, number> | null | undefined {
        if (!source) return target;
        if (!target) return source;
        for (const key in source) {
            const val = source[key];
            if (val && typeof val === "number") {
                const thisVal = target[key];
                if (!thisVal) {
                    target[key] = val;
                } else if (typeof thisVal === "number") {
                    target[key] = thisVal > val ? thisVal : val;
                }
            }
        }
        return target;
    }

    /**
     * 合并另一个物品到当前物品
     * @param obj - 要合并的物品
     */
    combine(obj: ITEM): void {
        if (this.is(obj)) {
            const other = obj as OBJ;
            if (other.temp || this.temp) {
                this.temp = this.combineTemp(this.temp, other.temp) as Record<string, number> | null;
            }
            this.count += (other.count || 0);
        }
    }

    /**
     * 克隆物品到目标容器
     * @param otype - 物品路径
     * @param to - 目标容器
     * @param count - 数量
     */
    static clone_to(otype: string, to: ITEM, count?: number): ITEM | undefined {
        if (!otype || !to) return undefined;
        let item = OBJ.CREATE(otype);
        if (!item) return undefined;
        count = count || 1;
        if (item.is_money && to.money !== undefined) {
            item.count = count;
            to.money += item.value * item.count;
            return item;
        }
        if (!to.items) to.items = [];
        if (item.combined) {
            for (let i = 0; i < to.items.length; i++) {
                if (to.items[i].is(item)) {
                    to.items[i].count += count;
                    return to.items[i];
                }
            }
            item.count = count;
            to.items.push(item);
        } else {
            to.items.push(item);
            for (let i = 0; i < count - 1; i++) {
                item = OBJ.CREATE(otype, 1);
                to.items.push(item);
            }
        }
        return item;
    }

    /**
     * 序列化物品数据用于数据库存储
     * @param str - 输出字符串数组
     */
    save_db(str: string[]): void {
        str.push('["', this.path ?? '', '","', this.id, '",', this.count.toString());
        if (this.is_locked) {
            str.push(',1');
        }
        if (this.temp)
            str.push(",", this.format_temp(this.temp));
        str.push(']');
    }

    /**
     * 从数据库记录恢复物品
     * @param data - 数据库记录数组
     */
    load_db(data: any[]): void {
        this.id = data[1];
        if (data[2] > 1) this.count = data[2];
        if (data[3]) {
            if (data[3] === 1) {
                this.is_locked = true;
            } else if (typeof data[3] === 'object') {
                this.temp = data[3];
                return;
            }
        }
        if (data[4]) this.temp = data[4];
    }

    /**
     * 加载后回调
     * @param me - 目标角色
     */
    on_load(me: CHARACTER): void {
        if (this.on_reload) this.on_reload(me);
    }

    /**
     * 克隆后回调（子类可覆写）
     */
    on_clone(): void {
        // overridable
    }

    /**
     * 通过原型克隆创建物品实例。
     * 使用 Object.create(base) 从缓存的模板（_WORLD.OBJ_STROE 或 BASE.CREATE 加载）克隆，
     * 避免每次重新实例化资源类。
     * @param otype - 物品路径
     * @param count - 可选数量（>1 时设置 this.count）
     */
    // @ts-ignore - OBJ.CREATE has different semantics from BASE.CREATE (instance factory vs resource loader)
    static CREATE(otype: string, count?: number): OBJ {
        otype = otype.replace(/\\/g, "/");
        let base = _WORLD?.OBJ_STROE.get(otype) as OBJ | undefined;
        if (!base) {
            base = BASE.CREATE(__PATH.OBJ, otype) as unknown as OBJ;
            if (!base) throw new Error('没有物品' + otype + "的定义。");
        }
        // Prototypal clone: create a new object inheriting from the cached prototype
        const item = Object.create(base) as OBJ;
        item.create_id();
        item.on_clone();
        if (count && count > 1)
            item.count = count;
        return item;
    }

    /**
     * 物品资源创建回调 — 资源文件加载时调用
     * @param path - 资源路径
     * @param par - 构造参数
     */
    create(path: string, par?: string): void {
        if (par) this.path = path + par;
        this.create_id();
        if (this.on_create) this.on_create(path, par);
        const cc = grade_color[this.grade] ?? 'wht';
        this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
        _WORLD?.OBJ_STROE.set(this.path ?? '', this);
    }

    /**
     * 物品资源热更新回调
     * @param path - 资源路径
     * @param par - 构造参数
     */
    update(path: string, par?: string): void {
        this.create(path, par);
    }

    /**
     * 查询品级颜色标签
     */
    query_grade_color(): string {
        return grade_color[this.grade] ?? 'wht';
    }

    /**
     * 通知客户端快捷按钮变更
     * @param me - 目标角色
     * @param isadd - true 添加，false 移除
     */
    notify_action(me: CHARACTER, isadd: boolean): void {
        if (!this.on_use) return;
        if (!this.showAction) return;
        if (isadd)
            me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
        else
            me.send("{type:'removeAction',id:'" + this.id + "'}");
    }

    /**
     * 按概率列表创建物品（随机掉落系统）
     * @param args - 掉落配置数组，每项包含：
     *   - odds     掉落概率（万分比，默认 10000）
     *   - obj      命中时的物品路径（string 或 string[]随机取一）
     *   - fall_obj 未命中时的保底物品路径
     *   - count    固定数量（与 min/max 互斥）
     *   - min/max  随机数量范围 [min, max]
     */
    static create_by_odds(args: OddsEntry[]): OBJ[] {
        const items: OBJ[] = [];
        if (!args) return items;
        for (let i = 0; i < args.length; i++) {
            const drop = args[i];
            if (!drop) continue;

            const per = Math.random() * 10000;
            let obj: string | string[] | undefined = (drop.odds ?? 10000) > per ? drop.obj : drop.fall_obj;
            if (obj) {
                let count = drop.count || 1;
                if (drop.min !== undefined && drop.max !== undefined) {
                    count = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                }
                if (count > 0) {
                    if (Array.isArray(obj)) obj = obj[Math.floor(Math.random() * obj.length)];
                    items.push(OBJ.CREATE(obj, count));
                }
            }
        }
        return items;
    }

    // ============ 格式化方法（由 extends 合并） ============

    format_to_sell(): string {
        return `[${JSON.stringify(this.color_name ?? "")},${JSON.stringify(this.id ?? "")},${this.count},${this.grade},${JSON.stringify(this.unit ?? "")},${this.value}]`;
    }

    format_to_pack(): string {
        return `[${JSON.stringify(this.color_name ?? "")},${JSON.stringify(this.id ?? "")},${this.count},${this.grade},${JSON.stringify(this.unit ?? "")},${this.transable ? this.value : 0},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0},${this.is_locked ? 1 : 0},${this.otype}]`;
    }
}
