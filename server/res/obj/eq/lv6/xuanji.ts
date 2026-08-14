import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '璇玑';
    desc = '滉漾明光，仙之至宝';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.NECKLACE;
    prop: PropMap = {
        str: 80,
        con: 80,
        dex: 80,
        per: 10,
        hp_per: 10,
        fy_per: 10,
        desc: '当你受到致命一击时不会立即死亡，冷却10分钟',
    };

    on_eq(me: CHARACTER): void {
        me.add_event('on_die', xuanji_guard, undefined, 0);
    }

    on_uneq(me: CHARACTER): void {
        me.remove_event('on_die', xuanji_guard);
    }
}

function xuanji_guard(this: CHARACTER, _killer?: CHARACTER): boolean | void {
    if (this.query_temp('eq/xuanji_cd')) return;
    this.set_temp('eq/xuanji_cd', 1, 600000);
    this.hp = 1;
    this.send_room('<him>$N胸前的璇玑迸发仙光，将本应致命的一击暂时封住！</him>');
    this.add_status({
        id: 'eq/xuanji_guard',
        name: '不灭',
        desc: '璇玑暂时护住了你的性命',
        duration: 3000,
        prop: { diff_sh_per: 10000 },
        override: 2,
    });
    return false;
}
