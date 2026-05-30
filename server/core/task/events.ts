/**
 * EVENTS 活动事件管理
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

/**
 * 活动项接口
 */
export interface EventItem {
    id: string;
    name?: string;
    desc?: string;
    time?: number;
    grade?: number;
    command?: string;
    check?: (user: any) => boolean;
    on_command?: (me: any) => void;
    query_desc(): string;
    query_grade(): number;
}

export class EVENTS extends BASE {

    /** 活动操作类型 */
    static ACTIONS: string[] = ['add', 'update', 'finish'];

    /**
     * 添加/更新活动
     * @param item - 活动对象
     */
    static add(item: any): void {
        if (!item || !item.id) return;
        Object.setPrototypeOf(item, EVENT_BASE);
        const items = WORLD.USER_EVENTS;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id == item.id) {
                items[i] = item;
                EVENTS.notify(item, 1);
                return;
            }
        }
        items.push(item);
        EVENTS.notify(item, 0);
    }

    /**
     * 通知所有符合条件的玩家
     * @param item - 活动
     * @param act - 操作索引(0添加 1更新 2完成)
     */
    static notify(item: { id: string; check?: (user: any) => boolean }, act: number): void {
        const users = WORLD.USERS;
        const msg = `{type: "dialog", dialog: "events",${EVENTS.ACTIONS[act]}:1}`;
        for (let user of users) {
            if (!(user as any).socket) continue;
            if (item.check && !item.check(user))
                continue;
            (user as any).send(msg);
        }
    }

    /**
     * 移除活动
     * @param id - 活动ID
     */
    static remove(id: string): any[] | undefined {
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
 */
const EVENT_BASE = {
    query_desc(this: any): string {
        return this.desc;
    },
    query_grade(this: any): number {
        return this.grade;
    }
};
