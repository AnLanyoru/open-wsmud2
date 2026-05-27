/**
 * USERTASK 玩家任务基类
 */
require("../util/util");

USERTASK = class USERTASK extends BASE {

    static __initInstance(obj) {
        // USERTASK has no instance properties to initialize
    }

    constructor() {
        super();
        USERTASK.__initInstance(this);
    }

    /**
     * 创建回调 - 注册到WORLD.TASKS
     * @param {string} path
     */
    create(path) {
        WORLD.TASKS.push(this);

        this.on_create && this.on_create();
    }

    /**
     * 任务更新(热更新)
     * @param {string} path
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
    query_title() {

    }

    /**
     * 开始任务
     * @returns {*}
     */
    start() {

    }

    /**
     * 查询任务描述
     * @returns {string|undefined}
     */
    query_desc() {

    }

    /**
     * 查询任务状态
     * @returns {number} 0不显示 1进行中 2可领取 3已完成
     */
    query_state() {
    }

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
