/**
 * TASK 系统任务基类
 */

/** @type {function} */
TASK = function () {

}
TASK.inherits(BASE);

/**
 * 创建回调 - 添加到系统任务列表并启动
 */
TASK.prototype.create = function () {
    WORLD.SYSTEMTASKS.push(this);
    this.startup();
}

/**
 * 根据ID获取系统任务
 * @param {string} id
 * @returns {TASK|undefined}
 */
TASK.GET = function (id) {
    for (var i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
        if (WORLD.SYSTEMTASKS[i].id == id) {
            return WORLD.SYSTEMTASKS[i];
        }
    }
}

/**
 * 任务更新(热更新)
 * @param {string} path
 */
TASK.prototype.update = function (path) {
    var oldtask = null;
    for (var i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
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
TASK.prototype.startup = function () {

}

/** 任务停止 */
TASK.prototype.stop = function () {

}
