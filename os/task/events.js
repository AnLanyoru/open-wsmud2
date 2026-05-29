/**
 * EVENTS 活动事件管理
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class EVENTS extends BASE {
    /**
     * 添加/更新活动
     * @param {{id: string, check: function(USER): boolean}} item - 活动对象
     * @returns {void}
     */
    static add(item) {
        if (!item || !item.id) return;
        Object.setPrototypeOf(item, EVENT_BASE);
        const items = WORLD.USER_EVENTS;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id == item.id) {
                items[i] = item;
                return this.notify(item, 1);
            }
        }
        items.push(item);
        this.notify(item, 0);
    }

    /** @type {string[]} 活动操作类型 */
    static ACTIONS = ['add', 'update', 'finish'];

    /**
     * 通知所有符合条件的玩家
     * @param {{id: string, check: function(USER): boolean}} item - 活动
     * @param {number} act - 操作索引(0添加 1更新 2完成)
     * @returns {void}
     */
    static notify(item, act) {
        const users = WORLD.USERS;
        const msg = `{type: "dialog", dialog: "events",${EVENTS.ACTIONS[act]}:1}`;
        for (let user of users) {
            if (!user.socket) continue;
            if (item.check && !item.check(user))
                continue;
            user.send(msg);
        }
    }

    /**
     * 移除活动
     * @param {string} id - 活动ID
     * @returns {Array|undefined}
     */
    static remove(id) {
        if (!id) return;
        const items = WORLD.USER_EVENTS;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id == id) {
                EVENTS.notify(items[i], 2);
                return items.splice(i, 1);
            }
        }
    }
}

/**
 * 活动基础原型对象
 * @type {{
 *   query_desc: function(): string,
 *   query_grade: function(): number
 * }}
 */

const EVENT_BASE = {
    /** @returns {string} */
    query_desc() {
        return this.desc;
    },
    /** @returns {number} */
    query_grade() {
        return this.grade;
    }
};
