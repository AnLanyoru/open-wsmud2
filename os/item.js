/**
 * ITEM 基类 - 所有物件的基类
 * 物件对命令的反应有几种方式实现：
 * 1. 直接实现ON_XXXX，cmd里定义的有直接对象的命令推荐这种
 * 2. add_action方式，房间里的指令推荐用这种
 * 3. on(xxx)方式，对房间里的命令的反映
 */
import { BASE } from "./base.js";
import { UTIL } from "./util/util.js";

export class ITEM extends BASE {

    /** 构造ITEM实例 */
    constructor() {
        super();
    }

    // ============ 核心标识属性 ============

    /** @type {string} 物件路径标识 */
    path;
    /** @type {string} 物件唯一ID */
    id;
    /** @type {string} 物件唯一UID */
    uid;
    /** @type {string} 物件名称 */
    name;

    // ============ 容器相关属性 ============

    /** @type {number} 最大携带物品数 */
    max_item_count = 10;
    /** @type {number} 金钱数量 */
    money = 0;
    /** @type {ITEM[]|null} 子物品列表 */
    items = null;
    /** @type {boolean} 是否为货币 — MONEY(=true), OBJ(=false) */
    is_money = false;
    /** @type {number} 物品价值(单价) — OBJ/MONEY专属, push_item:311用value*count算总价 */
    value = 0;
    /** @type {number} 物品数量 — OBJ子类(=1), push_item:311用value*count算总价 */
    count = 1;
    /** @type {boolean} 是否可堆叠 — OBJ(=true), CHARACTER/ROOM(=false) */
    combined = false;

    // ============ 交互相关属性 ============

    /** @type {Object<string, {name: string, action: Function}>|null} 可执行命令映射 */
    actions = null;
    /** @type {string|null} JSON缓存 */
    json = null;

    // ============ 跨分支公共属性(CHARACTER+OBJ子类共有) ============

    /** @type {string} 描述文本 — CHARACTER/OBJ/ROOM/AREA专属 */
    desc = "";
    /** @type {string} 带颜色的名称缓存 — CHARACTER/OBJ/EQUIPMENT专属 */
    color_name = "";
    /** @type {Object<string, *>|null} 临时数据 — CHARACTER/OBJ/EQUIPMENT/ROOM专属 */
    temp = null;
    /** @type {boolean} 是否为玩家 — ROOM遍历items判别, CHARACTER(=false)/USER(=true) */
    is_player = false;
    /** @type {boolean} 是否静默消息 — ROOM遍历items过滤旁观者消息 */
    no_message = false;
    /** @type {Object<string, number>|null} 属性加成映射 — CHARACTER/EQUIPMENT专属 */
    prop = null;

    /** @type {((path?: string, par?: string) => void)|null} 物件创建回调 — CHARACTER/OBJ/ROOM专属 */
    get on_create() { return undefined; }

    // ============ 堆叠操作(OBJ覆写, ITEM提供安全默认) ============

    /**
     * 合并物品 — 相同物品合并count和temp, OBJ覆写
     * @param {ITEM} obj - 要合并的物品
     */
    combine(obj) {
    }

    /**
     * 拆分堆叠 — 分出count个返回新物品, OBJ覆写
     * @param {number} count - 拆分数量
     * @returns {ITEM} 拆分出的物品(或this表示不拆分)
     */
    uncombine(count) {
        return this;
    }

    // ============ 临时数据存储(所有子类共用, ROOM覆写为副本查抄) ============

    /**
     * 查询临时数据 — 支持带过期时间的键值对({v, e}), 过期自动清除
     * @template T
     * @param {string} name - 键名
     * @param {T} [def] - 默认值
     * @returns {T}
     */
    query_temp(name, def) {
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
     * 设置临时数据 — 可选有效期, 超时自动失效
     * @template T
     * @param {string} name - 键名
     * @param {T} value - 值
     * @param {number} [time] - 有效期(毫秒)
     */
    set_temp(name, value, time) {
        if (!this.temp) this.temp = {};
        if (time) {
            this.temp[name] = {
                v: value,
                e: Date.now() + time
            };
        } else {
            this.temp[name] = value;
        }
    }

    /**
     * 移除临时数据
     * @param {string} name
     */
    remove_temp(name) {
        if (!this.temp) return;
        this.temp[name] = null;
    }

    /**
     * 累加临时数据
     * @param {string} name - 键名
     * @param {number} value - 累加值
     * @param {number} [time] - 有效期
     * @returns {number} 累加后的值
     */
    add_temp(name, value, time) {
        const val = this.query_temp(name, 0) + value;
        this.set_temp(name, val, time);
        return val;
    }

    // ============ 生命周期 ============

    /**
     * 通知消息 — CHARACTER覆写, ROOM::notify遍历items调用
     * @param {string} msg
     */
    notify(msg) {

    }

    /**
     * 心跳处理
     * @param {number} dt - 当前时间戳
     */
    heart_beat(dt) {

    }
    /**
     * 初始化
     */
    init() {

    }

    /**
     * 添加物件可以接收的命令(目标是当前对象的)
     * @param {string} cmd - 命令名
     * @param {string} name - 显示名称
     * @param {(this: this, ...args: any[]) => any} func - 执行函数
     * @returns {{name: string, action: Function}}
     */
    add_action(cmd, name, func) {
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
                action: func
            };
            this.actions[cmd] = act;
        }
        this.json = null;
        return act;
    }

    /**
     * 移除物件可以接收的命令
     * @param {string|string[]} name - 命令名或命令名数组
     * @param {function} [func]
     */
    remove_action(name, func) {
        if (!this.actions) this.actions = {};
        if (typeof (name) === "string") {
            delete this.actions[name];
        } else {
            for (let i = 0; i < name.length; i++) {
                delete this.actions[name[i]];
            }
        }
        this.json = null;
    }

    /**
     * 执行命令 返回true表示已经完成命令，后续不需要执行
     * @param {string} cmdName - 命令名
     * @param {Array<*>} pars - 参数列表
     * @returns {boolean} true表示已处理
     */
    exec(cmdName, pars) {
        if (this.actions) {
            const cmd = this.actions[cmdName];
            if (cmd && cmd.action) {
                return cmd.action.apply(this, pars);
            }
        }
        return false;
    }

    /**
     * 获取当前携带物品数量
     * @returns {number}
     */
    item_count() {
        return this.items ? this.items.length : 0;
    }

    /**
     * 判断背包是否已满
     * @param {number} [val] - 要添加的数量，不传判断是否已达上限
     * @returns {boolean}
     */
    is_full(val) {
        if (!this.items) return false;
        if (val) return this.items.length + val > this.max_item_count;

        return this.items.length >= this.max_item_count;
    }

    /**
     * 根据ID查找物品
     * @param {string} id - 物品ID
     * @returns {ITEM|null}
     */
    find_obj(id) {
        return null;
    }

    /**
     * 根据路径查找子物品
     * @param {string} path - 物品路径
     * @param {ITEM} [parent] - 父容器，默认this
     * @returns {ITEM|undefined}
     */
    find_obj_bypath(path, parent) {
        parent = parent || this;
        if (!parent.items) return;
        for (let i = 0; i < parent.items.length; i++) {
            if (parent.items[i].path === path) {
                return parent.items[i];
            }
        }
    }

    /**
     * 遍历子物品
     * @param {(item: ITEM) => (boolean | void)} func - 回调，返回false停止遍历
     * @param {ITEM} [parent] - 父容器，默认this
     */
    each_item(func, parent) {
        if (!func) return;
        parent = parent || this;
        const l = parent.items.length;
        for (let i = 0; i < l; i++) {
            const item = parent.items[i];
            if (!item) continue;
            if (func(item) === false) return;
        }
    }

    /**
     * 判断是否等于某物品
     * @param {ITEM|string|null} obj - 物品对象或路径
     * @returns {boolean}
     */
    is(obj) {
        if (!obj) return false;
        if (typeof obj === "string")
            return this.path === obj;
        return this.path === obj.path;
    }

    /**
     * 根据ID移除物品
     * @param {string} obj - 物品ID
     * @param {number} [count=0] - 拆分数量
     * @returns {ITEM|null} 移除的物品
     */
    remove_item_byid(obj, count = 0) {
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
     * @param {ITEM} obj - 物品对象
     * @param {number} [count] - 拆分数量
     * @returns {ITEM|null}
     */
    remove_item(obj, count) {
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
     * @param {ITEM} obj - 要移动的物品
     * @param {number} count - 数量
     * @param {ITEM} target - 目标容器
     * @returns {ITEM|undefined} 移动后的物品
     */
    move_item_to(obj, count, target) {
        if (!obj || !this.items) return;
        const moved_obj = this.remove_item(obj, count);
        if (!target) return;
        return target.push_item(moved_obj);
    }

    /**
     * 接收物品并入容器
     * @param {ITEM} moved_obj - 要加入的物品
     * @returns {ITEM|undefined} 入包后的物品
     */
    push_item(moved_obj) {
        if (!moved_obj) return;
        if (!this.items) this.items = [];
        if (moved_obj.is_money && this.money !== undefined) {

            this.money += moved_obj.value * moved_obj.count;
        } else if (moved_obj.combined) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].is(moved_obj)) {
                    this.items[i].combine(moved_obj);
                    return this.items[i];
                }
            }
            this.items.push(moved_obj);
        } else {
            this.items.push(moved_obj);
        }
        return moved_obj;
    }

    /**
     * 创建对象ID
     * @returns {void}
     */
    create_id() {
        this.id = UTIL.create_id();

    }

    /**
     * 刷新缓存
     * @returns {void}
     */
    refresh() {
        this.json = null;
    }

    /**
     * 是否隐藏
     * @returns {boolean}
     */
    is_hidden() {
        return false;
    }

    /**
     * 查询创建时间
     * @returns {Date|undefined}
     */
    query_create_time() {
        const id = this.id;
        if (!id) return;
        const time = parseInt(id.substr(4), 16);

        return new Date(time * 1000 + UTIL.begin);
    }

    /**
     * 在指定数组中根据ID查找物品
     * @param {ITEM[]} items - 物品数组
     * @param {string} oid - 物品ID
     * @returns {ITEM|undefined}
     */
    find_obj_byid(items, oid) {
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === oid) {
                return items[i];
            }
        }
    }

    /**
     * 完整显示名称 — getter, 子类可覆写为数据属性
     * @returns {string}
     */
    long_name() {
        return this.name;
    }
    /**
     * 对象创建回调
     * @param {string} file - 文件名
     * @param {string} [ctor] - 构造参数
     */
    create(file, ctor) {
        this.uid = this.create_uid();
    }

    /**
     * 销毁对象
     * @returns {void}
     */
    destroy() {

    }

    /**
     * 格式化临时数据为JSON字符串
     * @param {Object<string, *>} temp - 临时数据
     * @param {number} [timeout=120000] - 过期时限(毫秒)
     * @returns {string} JSON字符串
     */
    format_temp(temp, timeout = 120000) {
        if (!temp) return "{}";
        const dt = Date.now() + timeout;
        const tmp = ["{"];
        for (let key in temp) {
            const v = temp[key];
            if (!v) continue;
            if (v.e) {
                if (dt > v.e || !v.v) continue;
                if (tmp.length > 1) tmp.push(",");
                tmp.push("\"");
                tmp.push(key);
                tmp.push("\":{e:");
                tmp.push(v.e);
                tmp.push(",v:");
                if (typeof v.v == "string") {
                    tmp.push("\"");
                    tmp.push(v.v);
                    tmp.push("\"");
                } else {
                    tmp.push(v.v);
                }
                tmp.push("}");
            } else {
                if (tmp.length > 1) tmp.push(",");
                tmp.push("\"");
                tmp.push(key);
                tmp.push("\":");
                if (typeof v == "string") {
                    tmp.push("\"");
                    tmp.push(v);
                    tmp.push("\"");
                } else {
                    tmp.push(v);
                }
            }
        }
        tmp.push("}");
        return tmp.join("");
    }
}
