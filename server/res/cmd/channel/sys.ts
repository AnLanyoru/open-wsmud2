import { COMMAND } from '../../../core/command.js';
import { WORLD } from '../../../core/world.js';
import type { USER } from '../../../core/char/user.js';

export default class extends COMMAND {
    command = 'sys';
    allow_busy = true;
    allow_state = true;
    enter(me: USER, msg: string) {
        if (me) return;
        var msg = JSON.stringify({ type: 'msg', ch: 'sys', content: msg });
        WORLD.sendAll(msg);
    }
}
