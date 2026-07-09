import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';

export default class extends COMMAND {
    command = 'autopfm';
    allow_busy = true;
    allow_state = true;
    admin = true;
    allow_level = 6;

    enter(me: USER, _arg: string) {
        me.auto_pfm = !me.auto_pfm;
        if (me.auto_pfm) {
            me.init_pfms();
            me.send('已进入自动出招模式。');
        } else {
            me.send('已退出自动出招模式。');
        }
    }
}
