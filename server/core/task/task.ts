/**
 * TASK 系统任务基类 — 全局周期性任务（如门派巡逻、世界 Boss 等）
 *
 * 生命周期: create() → startup() → [热更新时 stop() → startup()] → 系统关闭时 stop()
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class TASK extends BASE {

    /** 定时器句柄（子类用于存放 setTimeout/setInterval 返回值） */
    time_handler: ReturnType<typeof setTimeout> | null = null;
    /** 备用定时器句柄 */
    handler: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        super();
    }

    /**
     * 创建回调 — 添加到 WORLD.SYSTEMTASKS 并启动
     */
    create(): void {
        WORLD.SYSTEMTASKS.push(this);
        this.startup();
    }

    /**
     * 根据 ID 获取系统任务
     * @param id - 任务 ID
     */
    static GET(id: string): TASK | undefined {
        for (let i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
            if (WORLD.SYSTEMTASKS[i].id == id) {
                return WORLD.SYSTEMTASKS[i];
            }
        }
    }

    /**
     * 任务热更新 — 先停止旧任务再启动当前任务
     * @param path - 任务资源文件路径
     */
    update(path: string): void {
        let oldtask: TASK | null = null;
        for (let i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
            if (WORLD.SYSTEMTASKS[i].path == path) {
                WORLD.SYSTEMTASKS[i].stop();
                oldtask = WORLD.SYSTEMTASKS[i];
                WORLD.SYSTEMTASKS[i] = this;
            }
        }
        if (!oldtask) {
            WORLD.SYSTEMTASKS.push(this);
        }
        this.startup(oldtask ?? undefined);
    }

    /**
     * 任务启动回调 — 子类覆写实现具体逻辑（如设置定时器、初始化状态）
     * @param oldtask - 旧任务实例（热更新时传入，用于迁移状态）
     */
    startup(oldtask?: TASK): void { return undefined; }

    /**
     * 任务停止回调 — 子类覆写清理定时器等资源
     */
    stop(): void { return undefined; }

    /**
     * 查询玩家货物列表 — 子类覆写（如押镖任务的货物）
     * @param me - 玩家角色
     */
    query_goods(me: Record<string, any>): any[] | undefined { return undefined; }

    /**
     * 设置/清除玩家货物缓存 — 子类覆写
     * @param me - 玩家角色
     * @param list - 物品列表，传 null 清除缓存
     */
    set_goods(me: Record<string, any>, list: any[] | null): void { return undefined; }
}
