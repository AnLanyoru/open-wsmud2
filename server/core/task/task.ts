/**
 * TASK 系统任务基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class TASK extends BASE {

    constructor() {
        super();
    }

    /**
     * 创建回调 - 添加到系统任务列表并启动
     */
    create(): void {
        WORLD.SYSTEMTASKS.push(this);
        this.startup();
    }

    /**
     * 根据ID获取系统任务
     * @param id
     */
    static GET(id: string): TASK | undefined {
        for (let i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
            if ((WORLD.SYSTEMTASKS[i] as any).id == id) {
                return WORLD.SYSTEMTASKS[i];
            }
        }
    }

    /**
     * 任务更新(热更新)
     * @param path
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
     * 任务启动
     * @param oldtask - 旧任务(热更新时)
     */
    startup(oldtask?: TASK): void { return undefined as unknown as void; }

    /** 任务停止 */
    stop(): void { return undefined as unknown as void; }

    /**
     * 查询玩家货物列表（子类重写）
     * @param me - 玩家角色
     */
    query_goods(me: Record<string, any>): unknown[] | undefined { return undefined; }

    /**
     * 设置/清除玩家货物缓存（子类重写）
     * @param me - 玩家角色
     * @param list - 物品列表，传null清除缓存
     */
    set_goods(me: Record<string, any>, list: unknown[] | null): void { return undefined as unknown as void; }
}
