/**
 * CONTAINER 容器类 — 可装入物品的物件
 */
import { OBJ } from './obj.js';
import { UTIL } from '../util.js';
import type { USER } from '../char/user.js';

/** 物品/容器描述 JSON 结构 */
export interface ItemDescJson {
    type: string;
    id: string;
    desc: string;
    commands: Array<{ cmd: string; name: string }>;
}

export class CONTAINER extends OBJ {

    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** 是否为容器 */
    is_container: boolean = true;
    /** 物品数量 */
    count: number = 1;
    /** 不可堆叠 */
    combined: boolean = false;
    /** 最大容纳物品数 */
    max_item_count: number = 50;
    /** 是否已打开 */
    is_open: boolean = false;

    /**
     * 禁止直接拾取容器
     * @param player - 玩家对象
     */
    on_get(player: USER): boolean {
        return false;
    }

    /**
     * 设置初始物品，支持变长参数：物品路径字符串 或 [路径, 数量]
     * @param args - 物品路径或 [路径, 数量] 元组
     */
    set_items(...args: (string | [string, number])[]): void {
        for (let i = 0; i < args.length; i++) {
            const item = args[i];
            if (item) {
                if (typeof item === "string") {
                    OBJ.clone_to(item, this);
                } else if (Array.isArray(item) && item.length >= 1) {
                    OBJ.clone_to(item[0], this, item[1]);
                }
            }
        }
    }

    /**
     * 查询容器内物品
     * @param me - 玩家对象
     */
    query_items(me: USER): OBJ[] | undefined {
        return (this.items ?? undefined) as OBJ[] | undefined;
    }

    /**
     * 获取带物品列表的描述文本
     * @param me - 玩家对象
     */
    get_desc(me: USER): string {
        const str: string[] = [this.color_name, this.desc];
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
     * 清空容器内所有物品
     * @param me - 玩家对象
     */
    clear_items(me: USER): void {
        if (this.items) this.items.length = 0;
    }

    /**
     * 查询描述 JSON（含"全部拾取"按钮）
     * @param me - 玩家对象
     */
    query_desc(me: USER): string {
        if (this.json) return this.json;
        const obj: ItemDescJson = {
            type: "item",
            id: this.id,
            desc: this.get_desc(me),
            commands: [],
        };
        obj.commands.push({
            cmd: "get all from " + this.id,
            name: "全部拾取"
        });
        this.json = JSON.stringify(obj);
        return this.json;
    }
}
