import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { USERTASK } from "../../../os/task/playertask.js";

export default class extends COMMAND {
    command = "task";
    regex = /(\w+)\s+(\w+)(?:\s(\w+))?(?:\s(\w+))?/;
    allow_state = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, tid, cmd, oid) {
    if (!tid || !cmd) return;
    if (!me.is_player || !WORLD.is_server(me)) return;
    if (tid === 'all') return this.tasks_fin(me);
    let task = USERTASK.GET(tid);
    if (!task) return me.notify("没有这个任务。");
    let target = null;
    if (!oid && !(ALLOW_COMMANDS[cmd])) {
        oid = cmd;
        cmd = 'start';
    }
    if (oid) {
        target = me.find_obj(oid, me.environment);
        if (!target) return me.notify("这里没有这个人。");
    }
    switch (cmd) {
        case "fin":
            this.task_fin(me, task);
            break;
        case "start":
            task.start(me, target);
            break;
        case "giveup":
            task.giveup(me);
            break;
        case "fin2":
            this.task_fin(me, task, 'ok');
            break;

    }
}
    task_fin(me, task, par) {
    if (task.on_finish(me, par)) {
        const obj = {};
        obj.type = "dialog";
        obj.dialog = "tasks";
        obj.id = task.id;
        obj.state = task.query_state(me);
        if (obj.state) {
            obj.title = task.query_title(me);
            obj.desc = task.query_desc(me);
        }
        return me.notify(JSON.stringify(obj));
    }
}
    tasks_fin(me) {
    for (let i = 0; i < WORLD.TASKS.length; i++) {
        const task = WORLD.TASKS[i];
        if (task.query_state(me) === 2) {
            this.task_fin(me, task);
        }
    }
}
}

const ALLOW_COMMANDS = {
    start: true,
    giveup: true,
    fin: true,
    fin2: true
};
