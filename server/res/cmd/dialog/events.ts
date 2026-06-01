import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";

export default class extends COMMAND {
    command = "events";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s+(\w+))$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type, paras) {
    let events = WORLD.USER_EVENTS;
    if (type) {
        for (let i = 0; i < events.length; i++) {
            let evt = events[i];
            if (evt.id === type) {
                if (this.check_command(evt, me)) {
                    if (evt.on_command?.(me, paras)) {
                        me.send('{type:"dialog",dialog:"events",close:true}');
                    }
                }
                return;
            }
        }
        return me.send('什么？');
    } else {
        let str = ['{type:"dialog",dialog:"events",items:['];
        let now = Date.now();
        for (let i = 0; i < events.length; i++) {
            let evt = events[i];
            if (evt.check && !evt.check(me))
                continue;
            if (evt.time > 0 && evt.time < now) {
                continue;
            }
            if (str.length > 1) str.push(',');
            str.push(`["${evt.id}","${evt.name}","${evt.query_desc(me)}",${evt.query_grade(me)},${evt.time},"${evt.command ?? ""}"]`);
        }

        str.push(']}');

        me.send(str.join(""));
    }

}
    check_command(event, me) {

    if (me.hp <= 0 && !event.allow_die) {
        return me.notify_fail("你现在是灵魂状态，不能那么做。");
    }
    if (!event.allow_faint && me.is_faint) {

        me.send("你正在昏迷中！");
        return false;
    }
    if (!event.allow_state && me.state) {
        return me.notify_fail("你正在" + me.state.title + "，没时间这么做。");
    }
    if (!event.allow_fight && me.fight_type > 0) {
        return me.notify_fail("你正在战斗，待会再说。");
    }
    if (!event.allow_busy && me.is_busy) {
        return me.notify_fail("你现在正忙。");
    }
    return true;
}
}

