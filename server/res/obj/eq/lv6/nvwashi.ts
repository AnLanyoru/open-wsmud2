import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';
import { WORLD } from '../../../../core/world.js';

export default class extends EQUIPMENT {
    unit = '颗';
    name = '女娲石';
    desc = '传说中女娲补天遗留下来的一块五彩神石';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.JEWELS;
    distime = 1800000;
    prop: PropMap = {
        lianxi_per: 40,
        dazuo_per: 40,
        hp_per: 20,
        con: 200,
        int: 200,
        desc: '使用后复活附近所有的玩家，冷却30分',
    };

    on_use(me: CHARACTER): boolean {
        const room = me.environment;
        if (!room) return false;
        const players = WORLD.USERS.filter(player => player !== me && player.environment === room && player.hp <= 0);
        if (!players.length) return me.notify_fail('附近没有需要复活的玩家。');

        me.send_room('<him>$N托起女娲石，五彩神光洒落四方，离散的魂魄重新凝聚！</him>');
        for (const player of players) {
            player.hp = player.max_hp;
            player.mp = player.max_mp;
            player.clear_status();
            player.notify('{type:"die",relive:true}');
            player.notify('<hig>女娲石的神力令你重新苏醒。</hig>');
            player.force_skill.on_relive?.(player);
            player.environment = undefined;
            player.moveto(room, '', '<him>$N的身影在五彩神光中重新凝实。</him>');
        }
        return true;
    }
}
