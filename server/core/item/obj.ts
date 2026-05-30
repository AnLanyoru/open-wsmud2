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

// ---- Odds entry for create_by_odds ----
export interface OddsEntry {
    odds?: number;
    obj?: string | string[];
    fall_obj?: string;
    count?: number;
    min?: number;
    max?: number;
}

export class OBJ extends ITEM {

    constructor() {
        super();
    }

    // ============ Core properties ============

    /** Unit name (个/把/件 etc.) */
    unit: string = "个";
    /** Item path identifier */
    path: string | null = null;
    /** Item count */
    count: number = 1;
    /** Whether stackable */
    combined: boolean = true;
    /** Grade (0-6) */
    grade: number = 0;
    /** Object type identifier */
    otype: number = 0;
    /** Whether tradable */
    transable: boolean = false;

    // ============ Display properties ============

    /** Color-tagged display name */
    color_name: string = "";
    /** Item description */
    desc: string = "";
    /** Item value */
    value: number = 0;
    /** Whether this is money */
    is_money: boolean = false;
    /** Whether this is equipment */
    is_equipment: boolean = false;
    /** Show action button */
    showAction: boolean = false;
    /** Cooldown between uses (ms) */
    distime: number = 0;

    // ============ Functional properties ============

    /** JSON description cache */
    json: string | null = null;
    /** Temporary data */
    temp: Record<string, any> | null = null;
    /** Max stack count */
    combine_count: number = 999;
    /** Whether locked */
    is_locked: boolean = false;
    /** Shortcut control -- EQUIPMENT only */
    is_shortcut: boolean = false;
    /** Equipment slot type -- EQUIPMENT only */
    eq_type: number = 0;
    /** Whether this is a container -- CONTAINER/CORPSE only */
    is_container: boolean = false;
    /** Whether the container is open -- CONTAINER/CORPSE only */
    is_open: boolean = false;

    // ============ Callbacks (set by resource files or subclasses) ============

    /** Use callback */
    on_use?(me: CHARACTER, par?: string): boolean | void;
    /** Study callback */
    on_study?(me: CHARACTER, skill: SKILL, lv: number): boolean | void;
    /** Open callback */
    on_open?(me: CHARACTER): OBJ[] | false | void;
    /** Init callback */
    on_init?(me: CHARACTER): void;
    /** Create callback */
    on_create?(path?: string, par?: string): void;
    /** Reload callback */
    on_reload?(me: CHARACTER): void;
    /** Get callback (set by resource files) */
    on_get?(player: CHARACTER): boolean | void;

    /**
     * Init hook
     */
    init(...args: any[]): void {
        const me = args[0] as CHARACTER | undefined;
        if (me && this.on_init) this.on_init(me);
    }

    /**
     * Full display name (including count)
     */
    long_name(): string {
        if (this.combined) return UTIL.to_c(this.count) + this.unit + this.color_name;
        return this.color_name;
    }

    /**
     * Unit name with optional count
     */
    unit_name(count?: number): string {
        return UTIL.to_c(count ?? this.count) + this.unit + this.color_name;
    }

    /**
     * JSON serialization of item
     */
    item_to_json(): string {
        return `["${this.name}","${this.id}",${this.count},${this.grade},"${this.unit}",${parseInt(String(this.value / 10), 10)},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0}]`;
    }

    /**
     * Query action commands for the item
     */
    query_commands(me: CHARACTER): string {
        return this.query_desc(me);
    }

    /**
     * Query description JSON
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
     * Get description text -- overridden by CONTAINER/EQUIPMENT/CORPSE
     */
    get_desc(me?: CHARACTER): string {
        return this.color_name + "\n" + this.desc;
    }

    /**
     * Split a stacked item
     * @param spcount - count to split off
     * @returns The new split item, or `this` if not splitting, or undefined if invalid
     */
    uncombine(spcount?: number): OBJ | undefined {
        if (!spcount || spcount === this.count) return this;
        if (spcount < this.count) {
            const item = this.clone();
            item.count = spcount;
            this.count -= spcount;
            return item;
        }
        return undefined;
    }

    /**
     * Clone this item
     */
    clone(me?: CHARACTER): OBJ {
        const item = OBJ.CREATE(this.path!);
        if (this.temp) {
            item.temp = Object.assign({}, this.temp);
        }
        return item;
    }

    /**
     * Merge temp properties (take max)
     */
    combineTemp(target: Record<string, number> | null | undefined, source: Record<string, number> | null | undefined): Record<string, number> | null | undefined {
        if (!source) return target;
        if (!target) return source;
        for (const key in source) {
            const val = source[key];
            if (val && typeof val === "number") {
                const thisVal = target[key];
                if (thisVal === undefined || thisVal === null) {
                    target[key] = val;
                } else if (typeof thisVal === "number") {
                    target[key] = thisVal > val ? thisVal : val;
                }
            }
        }
        return target;
    }

    /**
     * Combine another item into this one
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
     * Clone an item into a target container
     * @param otype - item path
     * @param to - target container
     * @param count - quantity
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
     * Serialize item for database
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
     * Restore item from database record
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
     * Post-load callback
     */
    on_load(me: CHARACTER): void {
        if (this.on_reload) this.on_reload(me);
    }

    /**
     * Post-clone callback
     */
    on_clone(): void {
        // overridable
    }

    /**
     * Create an item instance via prototypal cloning.
     *
     * Uses Object.create(base) to clone from a cached prototype (the
     * resource-file object stored in _WORLD.OBJ_STROE or loaded via
     * BASE.CREATE). This avoids the cost of re-instantiating the resource
     * class each time.
     *
     * @param otype - item path
     * @param count - optional quantity (>1 sets this.count)
     */
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
     * Item resource creation callback — called when the resource file is loaded
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
     * Item resource update callback
     */
    update(path: string, par?: string): void {
        this.create(path, par);
    }

    /**
     * Query grade color tag
     */
    query_grade_color(): string {
        return grade_color[this.grade] ?? 'wht';
    }

    /**
     * Notify client about action button change
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
     * Create items by probability list
     *
     * @param args - drop configuration array
     *   Each entry:
     *   - odds     drop probability (per 10k), default 10000
     *   - obj      item on hit (string path or string[])
     *   - fall_obj fallback item on miss (string path)
     *   - count    fixed quantity, default 1 (mutually exclusive with min/max)
     *   - min/max  random quantity range [min, max]
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

    // ============ Format methods (merged by extends) ============

    format_to_sell(): string {
        return `[${JSON.stringify(this.color_name ?? "")},${JSON.stringify(this.id ?? "")},${this.count},${this.grade},${JSON.stringify(this.unit ?? "")},${this.value}]`;
    }

    format_to_pack(): string {
        return `[${JSON.stringify(this.color_name ?? "")},${JSON.stringify(this.id ?? "")},${this.count},${this.grade},${JSON.stringify(this.unit ?? "")},${this.transable ? this.value : 0},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0},${this.is_locked ? 1 : 0},${this.otype}]`;
    }
}
