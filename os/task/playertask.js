/**
 * USERTASK 玩家任务基类
 */
require("../util/util");

/** @type {function} */
USERTASK = function () {

}
USERTASK.inherits(BASE);

/**
 * 创建回调 - 注册到WORLD.TASKS
 * @param {string} path
 */
USERTASK.prototype.create = function (path) {
    WORLD.TASKS.push(this);

    this.on_create && this.on_create();
}

/**
 * 任务更新(热更新)
 * @param {string} path
 */
USERTASK.prototype.update = function (path) {
    this.on_create && this.on_create();
    for (var i = 0; i < WORLD.TASKS.length; i++) {
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
USERTASK.prototype.query_title = function () {

}

/**
 * 开始任务
 * @returns {*}
 */
USERTASK.prototype.start = function () {

}

/**
 * 查询任务描述
 * @returns {string|undefined}
 */
USERTASK.prototype.query_desc = function () {

}

/**
 * 查询任务状态
 * @returns {number} 0不显示 1进行中 2可领取 3已完成
 */
USERTASK.prototype.query_state = function () {
}

/**
 * 运行指定ID的任务
 * @param {string} id - 任务ID
 * @param {USER} player - 玩家
 * @returns {*}
 */
USERTASK.RUN = function (id, player) {
    for (var i = 0; i < WORLD.TASKS.length; i++) {
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
USERTASK.GET = function (id) {
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        if (WORLD.TASKS[i].id == id) {
            return WORLD.TASKS[i];
        }
    }
}
