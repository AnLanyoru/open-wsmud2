import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'events';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s+(\w+))$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, type: string, params: string) {
        let events = WORLD.USER_EVENTS;
        if (type) {
            for (let i = 0; i < events.length; i++) {
                let evt = events[i];
                if (evt.id === type) {
                    if (this.check_command(me, evt)) {
                        if (evt.on_command?.(me, params)) {
                            me.send('{type:"dialog",dialog:"events",close:true}');
                        }
                    }
                    return;
                }
            }
            return me.send('什么？');
        } else {
            const items: Array<[string, string | undefined, string, number, number, string]> = [];
            let now = Date.now();
            for (let i = 0; i < events.length; i++) {
                let evt = events[i];
                if (evt.check && !evt.check(me)) continue;
                if ((evt.time ?? 0) > 0 && (evt.time ?? 0) < now) {
                    continue;
                }
                const evtTime = evt.time ?? 0;
                items.push([
                    evt.id,
                    evt.name,
                    evt.query_desc?.(me) ?? '',
                    evt.query_grade?.(me) ?? 0,
                    evtTime,
                    evt.command ?? '',
                ]);
            }

            me.send(JSON.stringify({ type: 'dialog', dialog: 'events', items }));
        }
    }
}
