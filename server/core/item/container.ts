/**
 * CONTAINER 容器类 — 可装入物品的物件
 */
import { OBJ } from './obj.js';
import { UTIL } from '../util.js';
import type { USER } from '../char/user.js';

export class CONTAINER extends OBJ {

    constructor() {
        super();
    }

    // ============ Core properties ============

    /** Whether this is a container */
    is_container: boolean = true;
    /** Item count */
    count: number = 1;
    /** Not stackable */
    combined: boolean = false;
    /** Max contained items */
    max_item_count: number = 50;
    /** Whether opened */
    is_open: boolean = false;

    /**
     * Prevent direct pickup of container
     */
    on_get(player: USER): boolean {
        return false;
    }

    /**
     * Set initial contents.
     * Accepts variadic args: item-path strings or [path, count] tuples.
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
     * Query contained items
     */
    query_items(me: USER): OBJ[] | undefined {
        return this.items ?? undefined;
    }

    /**
     * Get description text with contents listing
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
     * Clear all contained items
     */
    clear_items(me: USER): void {
        if (this.items) this.items.length = 0;
    }

    /**
     * Query description JSON (with "get all" command)
     */
    query_desc(me: USER): string {
        if (this.json) return this.json;
        const obj: Record<string, any> = {};
        obj.type = "item";
        obj.id = this.id;
        obj.desc = this.get_desc(me);
        obj.commands = [];
        obj.commands.push({
            cmd: "get all from " + this.id,
            name: "全部拾取"
        });
        this.json = JSON.stringify(obj);
        return this.json;
    }
}
