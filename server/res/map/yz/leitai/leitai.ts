import { ROOM } from '../../../../core/room/room.js';
import { WORLD } from '../../../../core/world.js';
import type { CHARACTER } from '../../../../core/char/character.js';
import biwu from '../../../cmd/extend/biwu.js';
import type { USER } from '../../../../core/char/user.js';

export default class BiWuLeiTaiRoom extends ROOM {
    name = '擂台';
    desc =
        '你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！';
    exits = {};
    max_item_count = 1;
    no_save = true;

    constructor() {
        super();
        this.add_action('fight', '', this.action_fight).allow_fight = true;
        this.add_action('kill', '', this.action_kill).allow_fight = true;
        this.add_action('dazuo', '', this.action_dazuo).allow_fight = true;
        this.add_action('liaoshang', '', this.action_liaoshang).allow_fight = true;
        this.add_action('perform', '', this.action_perform).allow_fight = true;
        this.add_action('unequip', '', this.action_unequip).allow_fight = true;
        this.add_action('enable', '', this.action_enable).allow_fight = true;
        this.add_action('surrender', '投降', this.surrender).allow_fight = true;
    }

    action_fight(me: CHARACTER) {
        me.notify('你正在擂台比试。');
        return true;
    }

    action_kill(me: CHARACTER) {
        me.notify('你正在擂台比试。');
        return true;
    }

    action_dazuo(me: CHARACTER) {
        me.notify('你正在擂台比试。');
        return true;
    }

    action_liaoshang(me: CHARACTER) {
        me.notify('你正在擂台比试。');
        return true;
    }

    action_perform(me: CHARACTER) {
        me.notify('擂台上自动出招。');
        return true;
    }

    action_unequip(me: CHARACTER) {
        me.notify('擂台上自动出招，不允许卸下装备。');
        return true;
    }

    action_enable(me: CHARACTER) {
        me.notify('擂台上自动出招，不能更改武功。');
        return true;
    }

    surrender(me: USER) {
        let biwu_cmd = WORLD.COMMANDS.get('biwu') as biwu;
        if (biwu_cmd) {
            biwu_cmd.surrender(me);
        }
        return true;
    }

    on_leave(me: CHARACTER, dir: string) {
        if (dir == 'fightend') {
            return true;
        }
        return me.notify_fail('你比试完才可以下擂台。');
    }
}
