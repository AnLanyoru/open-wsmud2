import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '先天太极图';
    desc = '武当至宝，先天太极';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.CLOTH;
    distime = 60000;
    prop: PropMap = {
        fy: 880,
        con: 200,
        diff_sh_per: 10,
        fy_per: 10,
        zj_per: 13,
        desc: '激活后8秒内无视伤害',
    };

    on_use(me: CHARACTER): boolean {
        me.send_room('<hiw>$N展开先天太极图，阴阳二气流转周身，万法一时皆不能侵！</hiw>');
        me.add_status({
            id: 'eq/xiantiantaijitu',
            name: '先天太极',
            desc: '先天太极图护体，普通伤害无法伤及自身',
            duration: 8000,
            prop: { diff_sh_per: 10000 },
            override: 2,
        });
        return true;
    }
}
