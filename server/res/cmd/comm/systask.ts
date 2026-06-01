import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { TASK } from "../../../core/task/task.js";

export default class extends COMMAND {
    command = "systask";
    regex = /(\w+)\s+(\w+)?/;
    allow_level = 6;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg, par) {
    if (!arg) return false;
    var task = TASK.GET(arg);
    if (!task) return false;
    // 仅允许调用 task 对象上的白名单方法
    let cmds = task.allow_commands;
    if (!cmds || !cmds[par])
        return false;
    // 禁止调用原型链上的危险属性
    if (BLOCKED_PROPS[par]) return false;
    var func = task[par];
    if (typeof func !== 'function') return;
    func.call(task, me);
}
}

const BLOCKED_PROPS = {
    constructor: true,
    __proto__: true,
    prototype: true,
    hasOwnProperty: true,
    toString: true,
    valueOf: true,
};
const ALLOW_COMMANDS = {
    bm: true,
    reward: true
};
