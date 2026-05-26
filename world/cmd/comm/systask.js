
this.inherits(COMMAND);
this.command = "systask";
this.regex = /(\w+)\s+(\w+)?/;
this.enter = function (me, arg, par) {
    if (!arg) return false;
    var task = TASK.GET(arg);
    if (!task) return false;
    if (me.user_level < 5) {
        let cmds = task.allow_commands;
        if (!cmds || !cmds[par])
            return false;
    }
    var func = task[par];
    if (!func) return;
    func.call(task, me);
}

const ALLOW_COMMANDS = {
    bm: true,
    reward: true
};