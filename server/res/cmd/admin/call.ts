import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'call';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    allow_level = 6;
    regex = /^(?:(\w+)\s)?(.+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, target: string, arg: string) {
        try {
            var func = new Function(arg);
            var player = me;
            if (target) {
                const other_player = WORLD.getUser(target);
                if (!other_player) return me.notify('没有这个玩家');
                player = other_player;
            }
            func.call(player);
            me.notify('ok');
        } catch (e) {
            console.log(e);
            me.notify('error:' + e);
        }
    }
}
