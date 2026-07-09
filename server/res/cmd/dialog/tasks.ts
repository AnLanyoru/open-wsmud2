import { USER } from '../../../core/char/user.js';
import { COMMAND } from '../../../core/command.js';
import type { USERTASK } from '../../../core/task/playertask.js';
import { WORLD } from '../../../core/world.js';

export interface TaskData {
    id: USERTASK['id'];
    title: ReturnType<USERTASK['query_title']>;
    desc: ReturnType<USERTASK['query_desc']>;
    state: ReturnType<USERTASK['query_state']>;
}

export default class extends COMMAND {
    command = 'tasks';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param me - 执行命令的角色
     */
    enter(me: USER, arg: string) {
        const obj: { type: string; dialog: string; items: TaskData[] } = {
            type: 'dialog',
            dialog: 'tasks',
            items: [],
        };
        for (let i = 0; i < WORLD.TASKS.length; i++) {
            const task = WORLD.TASKS[i];
            const state = task.query_state(me);
            if (!state) continue;
            const data: TaskData = {
                id: task.id,
                title: task.query_title(me),
                desc: task.query_desc(me),
                state: state,
            };
            obj.items.push(data);
        }
        me.notify(JSON.stringify(obj));
    }
}
