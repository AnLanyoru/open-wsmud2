/**
 * USERTASK 玩家任务基类 — 玩家个人任务（师门任务、日常任务等）
 *
 * 生命周期: create() → [玩家 start()] → 任务进行 → [完成/放弃]
 * 热更新: update() 替换 WORLD.TASKS 中的旧实例
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class USERTASK extends BASE {

    /** 任务创建回调 — 触发时机：任务资源文件加载/更新时调用（create/update 方法末尾） */
    on_create?: () => string | void;
    /** 任务启动回调（由资源文件动态注入） */
    on_start?: (player: Record<string, any>) => any;
    /** 任务完成回调（由资源文件动态注入） */
    on_finish?: (player: Record<string, any>) => any;

    constructor() {
        super();
    }

    /**
     * 创建回调 — 注册到 WORLD.TASKS 列表
     * @param path - 任务资源文件路径
     */
    create(path: string): void {
        WORLD.TASKS.push(this);
        this.on_create && this.on_create();
    }

    /**
     * 任务热更新 — 替换 WORLD.TASKS 中同路径的旧实例
     * @param path - 任务资源文件路径
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
     * 查询任务标题 — 子类覆写
     */
    query_title(): string | undefined { return undefined; }

    /**
     * 玩家开始任务 — 子类覆写
     * @param player - 玩家角色
     */
    start(player?: Record<string, any>): any { return undefined; }

    /**
     * 查询任务描述 — 子类覆写
     */
    query_desc(): string | undefined { return undefined; }

    /**
     * 查询任务状态 — 子类覆写
     * @returns 0=不显示 1=进行中 2=可领取 3=已完成
     */
    query_state(): number | undefined { return undefined; }

    /**
     * 运行指定 ID 的任务（对玩家触发）
     * @param id - 任务 ID
     * @param player - 玩家角色
     */
    static RUN(id: string, player: Record<string, any>): any {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if (WORLD.TASKS[i].id == id) {
                return WORLD.TASKS[i].start(player);
            }
        }
        return false;
    }

    /**
     * 根据 ID 获取玩家任务
     * @param id - 任务 ID
     */
    static GET(id: string): USERTASK | undefined {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if (WORLD.TASKS[i].id == id) {
                return WORLD.TASKS[i];
            }
        }
    }
}
