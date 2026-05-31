/**
 * EVENTS 活动事件管理
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

/**
 * 活动项接口 — 活动面板中的单个活动/事件条目
 */
export interface EventItem {
    /** 活动唯一 ID */
    id: string;
    /** 活动名称 */
    name?: string;
    /** 活动描述 */
    desc?: string;
    /** 活动结束时间戳 */
    time?: number;
    /** 活动品级（影响面板排序和颜色） */
    grade?: number;
    /** 活动操作按钮文本 */
    command?: string;
    /** 检查玩家是否可参与 — 返回 true 表示该玩家可见此活动 */
    check?: (user: Record<string, any>) => boolean;
    /** 活动按钮点击回调 — 触发时机：玩家在活动面板中点击该活动按钮时 */
    on_command?: (me: Record<string, any>) => void;
    /** 查询活动描述（由 EVENT_BASE 原型提供默认实现） */
    query_desc(): string;
    /** 查询活动品级（由 EVENT_BASE 原型提供默认实现） */
    query_grade(): number;
}

/**
 * EVENTS 活动事件管理器 — 管理活动面板的增删改通知
 *
 * 所有方法均为静态方法，不实例化。
 * 通过 WORLD.USER_EVENTS 维护活动列表，变更时广播通知符合条件的在线玩家。
 */
export class EVENTS extends BASE {

    /** 活动操作类型（add/update/finish，对应客户端不同的展示效果） */
    static ACTIONS: string[] = ['add', 'update', 'finish'];

    /**
     * 添加/更新活动
     * @param item - 活动对象
     */
    static add(item: EventItem): void {
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
    static notify(item: { id: string; check?: (user: Record<string, any>) => boolean }, act: number): void {
        const users = WORLD.USERS;
        const msg = `{type: "dialog", dialog: "events",${EVENTS.ACTIONS[act]}:1}`;
        for (const user of users) {
            if (!(user as Record<string, any>).socket) continue;
            if (item.check && !item.check(user))
                continue;
            (user as Record<string, any>).send(msg);
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
 * 活动基础原型对象 — 通过 Object.setPrototypeOf 注入到每个活动项，
 * 提供 query_desc / query_grade 默认实现
 */
const EVENT_BASE = {
    query_desc(this: any): string {
        return this.desc;
    },
    query_grade(this: any): number {
        return this.grade;
    }
};
