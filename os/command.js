/*
所有命令的基类，
自动加载所有定义在__COMMAND文件夹下的命令文件
*/


COMMAND = function () {
    this.allow_fight = true;
    this.allow_level = 0;
}

COMMAND.inherits(BASE);
//将命令绑定到某些对象上 调用obj.do_commandname();
COMMAND.prototype.for_item = function (item, name) {
    if (this.exec) {
        name = name || this.command;
        item.prototype["do_" + name] = this.exec;
    }
}
COMMAND.prototype.create = function (fname) {
    // console.error("command %s success", fname);
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
COMMAND.DO = function (cmd, par1, par2, par3) {
    var cmd = WORLD.COMMANDS[cmd];
    if (cmd) {
        cmd.enter(null, par1, par2, par3);
    }
}