import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";

export default class extends COMMAND {
    command = "tasks";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "tasks";
    obj.items = [];
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        var task = WORLD.TASKS[i];
        var state=task.query_state(me);
        if (!state) continue;
        obj.items.push({
            id:task.id,
            title: task.query_title(me),
            desc: task.query_desc(me),
            state: state,
        });
    }
    me.notify( JSON.stringify(obj));
}
}

