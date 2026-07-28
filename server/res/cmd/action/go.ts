import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'go';

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, dir: string) {
        if (me.hp <= 0) return;
        if (!dir) return me.notify('你要往哪里走？');
        dir = OUTER_DOORS[dir];
        if (!dir) return me.notify('你要往哪里走？');
        var cur_room = me.environment;
        if (!cur_room) {
            return me.notify('这里不知道怎么走。');
        }
        var rm = cur_room.exits && cur_room.exits[dir];
        if (!rm) return me.notify('这个方向没有出路。');
        // if (rm === " ") {
        //     console.log(me.name, cur_room.path);
        // }

        var next_room = WORLD.getRoom(rm);
        if (!next_room) {
            return me.notify(rm + '还没开放!');
        }
        if (me.fight_type > 0 && !me.do_escape()) {
            return;
        }
        if (me.is_rash) return me.notify('你现在没办法移动。');
        if (cur_room.owner) {
            //当前房间在副本区域
            var copyroom = next_room.query_copy(cur_room.owner);
            if (copyroom) {
                next_room = copyroom;
            } else {
                if (cur_room.is_fb()) {
                    //不能从副本直接出去
                    return me.notify('这里不能过去。');
                }
            }
        }

        if (me.query_temp('killer')) {
            if (next_room.is_copy() || next_room.no_fight)
                return me.notify('你现在正在被追杀，不能进入安全区和副本区域。');
        }
        me.moveto(next_room, undefined, undefined, dir);
    }
}

var OUTER_DOORS = {};
var doors = [
    'west',
    'north',
    'south',
    'east',
    'northwest',
    'southwest',
    'northeast',
    'southeast',
    'down',
    'up',
    'westdown',
    'northdown',
    'southdown',
    'eastdown',
    'westup',
    'northup',
    'southup',
    'eastup',
    'enter',
    'out',
];
var doors_short = [
    'w',
    'n',
    's',
    'e',
    'nw',
    'sw',
    'ne',
    'se',
    'd',
    'u',
    'wd',
    'nd',
    'sd',
    'ed',
    'wu',
    'nu',
    'su',
    'eu',
];
for (var i = 0; i < doors.length; i++) {
    if (i < doors_short.length) {
        OUTER_DOORS[doors_short[i]] = doors[i];
    }
    OUTER_DOORS[doors[i]] = doors[i];
}
