/**
 * TASK 系统任务基类
 */

TASK = class TASK extends BASE {

    static __initInstance(obj) {
        // TASK has no instance properties to initialize
    }

    constructor() {
        super();
        TASK.__initInstance(this);
    }

    /**
     * 创建回调 - 添加到系统任务列表并启动
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
     */
    startup() {

    }

    /** 任务停止 */
    stop() {

    }
}
