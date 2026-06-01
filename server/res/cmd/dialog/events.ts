import { COMMAND } from "../../../core/command.js";
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
                if (this.check_command(me, evt as Partial<Pick<COMMAND, 'allow_die' | 'allow_faint' | 'allow_state' | 'allow_fight' | 'allow_busy'>>)) {
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
            if ((evt.time ?? 0) > 0 && (evt.time ?? 0) < now) {
                continue;
            }
            if (str.length > 1) str.push(',');
            const evtTime = evt.time ?? 0;
            str.push(`["${evt.id}","${evt.name}","${evt.query_desc?.(me) ?? ""}",${evt.query_grade?.(me) ?? 0},${evtTime},"${evt.command ?? ""}"]`);
        }

        str.push(']}');

        me.send(str.join(""));
    }

}}

