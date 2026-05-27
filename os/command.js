/**
 * 所有命令的基类，
 * 自动加载所有定义在__COMMAND文件夹下的命令文件
 */

/** @type {function} */
COMMAND = function () {
    /** @type {boolean} 是否允许在战斗中执行 */
    this.allow_fight = true;
    /** @type {number} 允许执行的最小等级 */
    this.allow_level = 0;
}

COMMAND.inherits(BASE);

/**
 * 将命令绑定到某些对象上，调用方式: obj.do_commandname()
 * @param {function} item - 目标类构造函数
 * @param {string} [name] - 命令名，默认使用this.command
 */
COMMAND.prototype.for_item = function (item, name) {
    if (this.exec) {
        name = name || this.command;
        item.prototype["do_" + name] = this.exec;
    }
}

/**
 * 命令创建回调，注册到WORLD.COMMANDS
 * @param {string} fname - 命令文件名
 */
COMMAND.prototype.create = function (fname) {
    if (this.command) {
        var str = this.command.split(',');
        for (var i = 0; i < str.length; i++) {
            if (WORLD.COMMANDS[str[i]]) console.error("command %s 重复", fname);
            WORLD.COMMANDS[str[i]] = this;
        }
    } else {
        console.error("command %s not have command name", fname);
    }
}

/**
 * 命令更新回调
 */
COMMAND.prototype.update = function () {
    if (this.command) {
        var str = this.command.split(',');
        for (var i = 0; i < str.length; i++) {
            WORLD.COMMANDS[str[i]] = this;
        }
    } else {
        console.error("command %s not have command name", fname);
    }
}

/**
 * 执行指定命令
 * @param {string} cmd - 命令名
 * @param {*} [par1]
 * @param {*} [par2]
 * @param {*} [par3]
 */
COMMAND.DO = function (cmd, par1, par2, par3) {
    var cmd = WORLD.COMMANDS[cmd];
    if (cmd) {
        cmd.enter(null, par1, par2, par3);
    }
}
