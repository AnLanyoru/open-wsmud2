/**
 * OBJ 普通物品基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { ITEM } from "../item.js";
import { UTIL } from "../util/util.js";

export class OBJ extends ITEM {

    /** 构造OBJ实例 */
    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** @type {string} 单位(个/把/件等) */
    unit = "个";
    /** @type {string|null} 物品路径标识 */
    path = null;
    /** @type {number} 物品数量 */
    count = 1;
    /** @type {boolean} 是否可堆叠合并 */
    combined = true;
    /** @type {number} 品级(0-6) */
    grade = 0;
    /** @type {number} 物件类型标识 */
    otype = 0;
    /** @type {boolean} 是否可交易 */
    transable = false;

    // ============ 显示属性 ============

    /** @type {string} 带颜色的显示名称 */
    color_name;
    /** @type {string} 物品描述 */
    desc;
    /** @type {number} 物品价值 */
    value = 0;
    /** @type {boolean} 是否为金钱 */
    is_money = false;
    /** @type {boolean} 是否为装备 */
    is_equipment = false;
    /** @type {boolean} 显示动作按钮 */
    showAction = true;
    /** @type {number} 连续使用间隔(毫秒) */
    distime = 0;

    // ============ 功能属性 ============

    /** @type {string|null} JSON描述缓存 */
    json = null;
    /** @type {Object<string, *>|null} 临时数据 */
    temp = null;
    /** @type {number} 最大叠加数量 */
    combine_count = 999;
    /** @type {boolean} 是否已锁定 */
    is_locked = false;

    // ============ 回调函数(由资源文件设置) ============

    /** @type {((me: CHARACTER) => void)|null} 使用回调 */
    on_use = null;
    /** @type {((me: CHARACTER) => void)|null} 修炼回调 */
    on_study = null;
    /** @type {((me: CHARACTER) => void)|null} 打开回调 */
    on_open = null;
    /** @type {((me: CHARACTER) => void)|null} 初始化回调 */
    on_init = null;
    /** @type {((path: string, par?: string) => void)|null} 创建后回调 */
    on_create = null;
    /** @type {((me: CHARACTER) => void)|null} 热重载回调 */
    on_reload = null;

    /**
     * 初始化回调
     * @param {CHARACTER} [me]
     */
    init(me) {
        this.on_init && this.on_init(me);
    }

    /**
     * 完整名称(含数量)
     * @returns {string}
     */
    long_name() {
        if (this.combined) return UTIL.to_c(this.count) + this.unit + this.color_name;
        return this.color_name;
    }

    /**
     * 带数量的单位名称
     * @param {number} [count]
     * @returns {string}
     */
    unit_name(count) {
        return UTIL.to_c(count || this.count) + this.unit + this.color_name;

    }

    /**
     * 物品JSON序列化
     * @returns {string}
     */
    item_to_json() {
        return `["${this.name}","${this.id}",${this.count},${this.grade},"${this.unit}",${parseInt(this.value / 10)},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0}]`;
    }

    /**
     * 查询操作命令
     * @param {USER} me
     * @returns {string} JSON
     */
    query_commands(me) {
        return this.query_desc(me);
    }

    /**
     * 查询描述JSON
     * @param {USER} me
     * @returns {string} JSON
     */
    query_desc(me) {
        if (this.json) return this.json;
        const obj = {};
        obj.type = "item";
        obj.id = this.id;
        obj.desc = this.get_desc(me);
        obj.commands = [];
        obj.commands.push({
            cmd: "get " + this.id,
            name: "捡起"
        });

        this.json = JSON.stringify(obj)
        return this.json;
    }

    /**
     * 获取描述文本
     * @returns {string}
     */
    get_desc() {
        return this.color_name + "\n" + this.desc;
    }

    /**
     * 拆分堆叠物品
     * @param {number} spcount - 拆分数量
     * @returns {OBJ} 拆分后的新物品(或this)
     */
    uncombine(spcount) {
        if (!spcount || spcount === this.count) return this;
        if (spcount < this.count) {
            const item = this.clone();
            item.count = spcount;
            this.count -= spcount;
            return item;
        }
    }

    /**
     * 克隆物品
     * @returns {OBJ}
     */
    clone() {
        const item = OBJ.CREATE(this.path);
        if (this.temp) {
            item.temp = Object.assign({}, this.temp);
        }
        return item;
    }

    /**
     * 合并临时属性(取最大值)
     * @param {Object<string, number>} target
     * @param {Object<string, number>} source
     * @returns {Object<string, number>}
     */
    combineTemp(target, source) {
        if (!source) return target;
        if (!target) return source;
        for (let key in source) {
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
     * 合并堆叠物品
     * @param {OBJ} obj - 要合并的物品
     */
    combine(obj) {
        if (this.is(obj)) {
            if (obj.temp || this.temp) {
                this.temp = this.combineTemp(this.temp, obj.temp);
            }
            this.count += (obj.count || 0);
        }
    }


    /**
     * 克隆物品到目标容器
     * @param {string} otype - 物品路径
     * @param {ITEM} to - 目标容器
     * @param {number} [count=1] - 数量
     * @returns {OBJ|undefined}
     */
    static clone_to(otype, to, count) {
        if (!otype || !to) return;
        let item = OBJ.CREATE(otype);
        if (!item) return;
        count = count || 1;
        if (item.is_money && to.money != undefined) {
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
     * 物品存档序列化
     * @param {string[]} str - 输出数组
     */
    save_db(str) {
        str.push('["', this.path, '","', this.id, '",', this.count);
        if (this.is_locked) {
            str.push(',1');
        }
        if (this.temp)
            str.push(",", this.format_temp(this.temp));
        str.push(']');

    }

    /**
     * 从数据库记录恢复物品
     * @param {Array<*>} data - [path, id, count, ...]
     */
    load_db(data) {

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
     * 物品加载后回调
     * @param {CHARACTER} me
     */
    on_load(me) {
        this.on_reload && this.on_reload(me);
    }

    /**
     * 克隆后回调
     * @returns {void}
     */
    on_clone() {

    }

    /**
     * 创建物品实例
     * @param {string} otype - 物品路径
     * @param {number} [count] - 数量
     * @returns {OBJ}
     */
    static CREATE(otype, count) {
        let base = WORLD.OBJ_STROE.get(otype);
        if (!base) {
            base = BASE.CREATE(__PATH.OBJ, otype);
            if (!base) throw new Error('没有物品' + otype + "的定义。");
        }

        const item = Object.create(base);
        item.create_id();
        item.on_clone();
        if (count > 1)
            item.count = count;
        return item;
    }

    /**
     * 物品创建回调
     * @param {string} path
     * @param {string} [par] - 参数
     */
    create(path, par) {
        if (par) this.path = path + par;
        this.create_id();
        this.on_create && this.on_create(path, par);
        const cc = grade_color[this.grade];
        this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
        WORLD.OBJ_STROE.set(this.path, this);
    }

    /**
     * 物品更新回调
     * @param {string} path
     * @param {string} [par]
     */
    update(path, par) {
        this.create(path, par);
    }



    /**
     * 查询品级颜色
     * @returns {string}
     */
    query_grade_color() {
        return grade_color[this.grade];
    }

    /**
     * 通知客户端物品动作按钮变更
     * @param {USER} me
     * @param {boolean} isadd
     */
    notify_action(me, isadd) {
        if (!this.on_use) return;
        if (!this.showAction) return;
        if (isadd)
            me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
        else
            me.send("{type:'removeAction',id:'" + this.id + "'}");
    }

    /** @type {function} 临时数据(复用CHARACTER) */
    query_temp = globalThis.CHARACTER.prototype.query_temp;
    /** @type {function} */
    set_temp = globalThis.CHARACTER.prototype.set_temp;
    /** @type {function} */
    remove_temp = globalThis.CHARACTER.prototype.remove_temp;
    /** @type {function} */
    add_temp = globalThis.CHARACTER.prototype.add_temp;

    /**
     * 根据概率列表创建物品
     * @param {Array<{odds: number, obj: string, fall_obj: string, count: number, min: number, max: number}>} args - 掉落定义
     * @returns {OBJ[]}
     */
    static create_by_odds(args) {
        const items = [];
        if (!args) return items;
        let drop = null, per = null,
            obj = null;
        for (let i = 0; i < args.length; i++) {
            drop = args[i];
            if (!drop) continue;

            per = Math.random() * 10000;
            obj = (drop.odds || 10000) > per ? drop.obj : drop.fall_obj;
            if (obj) {
                if (drop.min_count) hit_count = 0;
                let count = drop.count || 1;
                if (drop.min && drop.max) {
                    count = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                }
                if (count > 0) {
                    if (obj instanceof Array) obj = obj.random();
                    items.push(OBJ.CREATE(obj, count));
                }
            }
        }
        return items;
    }
}

/** @type {string[]} 品级颜色 */
const grade_color = ["wht", "hig", "hic", "hiy", "HIZ", "hio", "ord"];
globalThis.OBJ = OBJ;
