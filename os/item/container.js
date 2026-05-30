/**
 * CONTAINER 容器类 - 可装入物品的物件
 */
import { OBJ } from "./obj.js";
import { UTIL } from "../util/util.js";

export class CONTAINER extends OBJ {

    /** 构造CONTAINER实例 */
    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** @type {boolean} 是否为容器 */
    is_container = true;
    /** @type {number} 物品数量 */
    count = 1;
    /** @type {boolean} 是否可堆叠合并 */
    combined = false;
    /** @type {number} 最大容纳物品数 */
    max_item_count = 50;
    /** @type {boolean} 是否已打开 */
    is_open = false;

    /**
     * 禁止直接拾取容器
     * @param {USER?} player
     * @returns {boolean} false
     */
    on_get(player) {
        return false;
    }

    /**
     * 设置初始内容物
     * @param {...(string|[string, number])} arguments - 物品路径或[物品路径, 数量]
     */
    set_items() {
        for (let i = 0; i < arguments.length; i++) {
            const item = arguments[i];
            if (item) {
                if (typeof item == "string") {
                    OBJ.clone_to(item, this);
                } else if (item.length) {
                    OBJ.clone_to(item[0], this, item[1]);
                }
            }
        }
    }

    /**
     * 查询内容物
     * @param {USER} me
     * @returns {OBJ[]}
     */
    query_items(me) {
        // @ts-ignore
        return this.items;
    }

    /**
     * 获取描述文本
     * @param {USER} me
     * @returns {string}
     */
    get_desc(me) {
        const str = [this.color_name, this.desc];
        const items = this.query_items(me);
        if (items && items.length) {
            str.push("它里面有：");
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                str.push("\t" + UTIL.to_c(item.count) + item.unit + item.color_name);
            }
        } else {
            str.push("它里面什么都没有。");
        }
        return str.join("\n");
    }

    /**
     * 清空内容物
     * @param {USER} me
     */
    clear_items(me) {
        this.items.length = 0;
    }

    /**
     * 查询描述JSON(含全部拾取命令)
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
            cmd: "get all from " + this.id,
            name: "全部拾取"
        });

        this.json = JSON.stringify(obj)
        return this.json;
    }

}
