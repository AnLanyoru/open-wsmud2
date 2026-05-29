/**
 * USERTASK 玩家任务基类
 */
import { UTIL } from "../util/util.js";
import { BASE } from "../base.js";
import { WORLD } from "../world.js";

export class USERTASK extends BASE {

    /**
     * @returns {USERTASK}
     */
    constructor() {
        super();
    }

    /**
     * 创建回调 - 注册到WORLD.TASKS
     * @param {string} path
     * @returns {void}
     */
    create(path) {
        WORLD.TASKS.push(this);

        this.on_create && this.on_create();
    }

    /**
     * 任务更新(热更新)
     * @param {string} path
     * @returns {void}
     */
    update(path) {
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
     * @returns {string|undefined}
     */
    query_title() { return undefined; }

    /**
     * 开始任务
     * @returns {*}
     */
    start() { return undefined; }

    /**
     * 查询任务描述
     * @returns {string|undefined}
     */
    query_desc() { return undefined; }

    /**
     * 查询任务状态
     * @returns {number} 0不显示 1进行中 2可领取 3已完成
     */
    query_state() { return undefined; }

    /**
     * 运行指定ID的任务
     * @param {string} id - 任务ID
     * @param {USER} player - 玩家
     * @returns {*}
     */
    static RUN(id, player) {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if (WORLD.TASKS[i].id == id) {
                return WORLD.TASKS[i].start(player);
            }
        }
        return false;
    }

    /**
     * 根据ID获取任务
     * @param {string} id
     * @returns {USERTASK|undefined}
     */
    static GET(id) {
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            if (WORLD.TASKS[i].id == id) {
                return WORLD.TASKS[i];
            }
        }
    }
}
