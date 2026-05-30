/**
 * TASK 系统任务基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class TASK extends BASE {

    /**
     * @returns {TASK}
     */
    constructor() {
        super();
    }

    /**
     * 创建回调 - 添加到系统任务列表并启动
     * @returns {void}
     */
    create() {
        WORLD.SYSTEMTASKS.push(this);
        this.startup();
    }

    /**
     * 根据ID获取系统任务
     * @param {string} id
     * @returns {TASK|undefined}
     */
    static GET(id) {
        for (let i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
            if (WORLD.SYSTEMTASKS[i].id == id) {
                return WORLD.SYSTEMTASKS[i];
            }
        }
    }

    /**
     * 任务更新(热更新)
     * @param {string} path
     * @returns {void}
     */
    update(path) {
        let oldtask = null;
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
        this.startup(oldtask);
    }

    /**
     * 任务启动
     * @param {TASK} [oldtask] - 旧任务(热更新时)
     * @returns {void}
     */
    startup() { return undefined; }

    /** @returns {void} 任务停止 */
    stop() { return undefined; }

    /**
     * 查询玩家货物列表（子类重写）
     * @param {CHARACTER} me - 玩家角色
     * @returns {OBJ[]} 为该玩家生成的物品列表
     */
    query_goods(me) { return undefined; }

    /**
     * 设置/清除玩家货物缓存（子类重写）
     * @param {CHARACTER} me - 玩家角色
     * @param {OBJ[]|null} list - 物品列表，传null清除缓存
     * @returns {void}
     */
    set_goods(me, list) { return undefined; }
}
