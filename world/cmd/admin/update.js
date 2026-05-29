import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { NPC } from "../../../os/char/npc.js";
import { BASE } from "../../../os/base.js";
import { TASK } from "../../../os/task/task.js";

export default class extends COMMAND {
    command = "update";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    try {
        if (!arg) return this.notify(me, "路径不合理");
        if (arg === 'room') {
            return this.update_room(me);
        } else if (arg === 'npc') {
            return this.update_npc(me);
        }
        arg = arg.replace(/\\/g, "/");
        if (arg.startsWith("doc/")) return;
        var index = arg.indexOf("/");
        if (index == -1) return this.notify(me, "路径不合理");
        var path = __PATH.WORLD + arg.substr(0, index + 1);
        var fname = arg.substr(index + 1);
        BASE.UPDATE(path, fname);
        this.notify(me, arg + "已更新。");
    } catch (e) {
        console.log(e);
        this.notify(me, "error:" + e);
    }
}
    notify(me, msg) {
    if (me) return me.notify(msg);
    console.log(msg);
}
    update_npc(me, path) {
    this.enter(me, "npc/" + path);
    let npc = me.environment.find_obj_bypath(path);
    if (npc) {
        npc.destroy();
        NPC.CREATE(path, me.environment);
    }
    let map = WORLD.NPC_STROE;
    npc = map.get(path);
    if (!npc.on_create) return;
    let keys = map.keys();
    path = path + "#";
    for (let key of keys) {
        if (key.startsWith(path)) {
            map.delete(key);
            me.send('delete' + key);
        }
    }
}
    update_obj(me, path) {
    this.enter(me, "obj/" + path);
    let map = WORLD.OBJ_STROE;
    let obj = map.get(path);
    if (!obj.on_create) return;
    let keys = map.keys();
    path = path + "#";
    for (let key of keys) {

        if (key.startsWith(path)) {
            map.delete(key);
            me.send('delete' + key);
        }
    }

}
    update_room() {

}
    clear_update() {
    if (this.update_hander)
        clearTimeout(this.update_hander);
    this.update_time = null;
    console.log('clear timeout');
}
    wait_update(me, upd_time) {
    if (!upd_time) return me.send('没有设置更新时间');
    if (typeof upd_time === 'string') {
        upd_time = new Date(upd_time);
    }
    let time = upd_time - Date.now();
    if (!(time > 10000))
        return me.send('更新时间不能小于当前时间');
    this.update_hander = this.call_out(this.on_update, time);
    this.update_time = upd_time;
    this.format_time(me, this.update_time);
}
    format_time(me, time) {

    let str = ['已设置', time.toLocaleString(), '更新，在'];
    time = time - Date.now();
    if (time > 3600000) {
        str.push(Math.floor(time / 3600000), "小时");
        time = time % 3600000;
    }
    if (time > 60000) {
        str.push(Math.floor(time / 60000), "分钟");
        time = time % 60000;
    }
    time = Math.floor(time / 1000);
    str.push(time, '秒后');
    me.send(str.join(""));
}
    on_update() {
    this.update_hander = null;
    this.update_time = null;
}
    wait(me) {
    let task = TASK.GET('time');
    let updtime = new Date(2026, 1, 15, 12);
    let time = updtime.getTime() - Date.now();
    task.handler = task.call_out(task.run2, time);
    this.format_time(me, updtime);
}
}

const __PATH = globalThis.__PATH;
if (WORLD.COMMANDS.update && WORLD.COMMANDS.update.clear_update) {
    WORLD.COMMANDS.update.clear_update();
}
