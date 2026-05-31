/**
 * USERTASK 玩家任务基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class USERTASK extends BASE {

    /** 任务创建回调 — 触发时机：任务资源文件加载/更新时调用（create/update 方法末尾） */
    on_create?: () => string | void;

    constructor() {
        super();
    }

    /**
     * 创建回调 - 注册到WORLD.TASKS
     * @param path
     */
    create(path: string): void {
        WORLD.TASKS.push(this);
        this.on_create && this.on_create();
    }

    /**
     * 任务更新(热更新)
     * @param path
     */
    update(path: string): void {
        this.on_create && this.on_create();
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if (WORLD.TASKS[i].path == path) {
                WORLD.TASKS[i] = this;
                return;
            }
        }
        WORLD.TASKS.push(this);
    }

    /**
     * 查询任务标题
     */
    query_title(): string | undefined { return undefined; }

    /**
     * 开始任务
     */
    start(player?: Record<string, any>): unknown { return undefined; }

    /**
     * 查询任务描述
     */
    query_desc(): string | undefined { return undefined; }

    /**
     * 查询任务状态
     * @returns 0不显示 1进行中 2可领取 3已完成
     */
    query_state(): number | undefined { return undefined; }

    /**
     * 运行指定ID的任务
     * @param id - 任务ID
     * @param player - 玩家
     */
    static RUN(id: string, player: Record<string, any>): unknown {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if ((WORLD.TASKS[i] as any).id == id) {
                return WORLD.TASKS[i].start(player);
            }
        }
        return false;
    }

    /**
     * 根据ID获取任务
     * @param id
     */
    static GET(id: string): USERTASK | undefined {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if ((WORLD.TASKS[i] as any).id == id) {
                return WORLD.TASKS[i];
            }
        }
    }
}
