import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '柄';
    name = '太阴';
    desc = '一柄通体暗紫的小剑，剑身上处处布满碎痕，弥漫着阵阵寒意，似乎冻结着周围的时间。';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.THROWING;
    weapon_type = WEAPON_TYPE.THROWING;
    distime = 60000;
    prop: PropMap = {
        desc: '激活太阴蕴含力量使敌人不可抵抗的减缓攻速和冷却时间',
    };

    on_use(me: CHARACTER): boolean {
        const target = me.query_enemy();
        if (!target) return me.notify_fail('你现在没有战斗目标。');
        const percent = 20 + this.level;
        me.send_room('<him>$N激活太阴，凝滞时光的寒意瞬间笼罩$n！</him>', target);
        target.add_status({
            id: 'eq/taiyin',
            name: '太阴',
            desc: '你的攻击速度和绝招冷却被太阴之力减缓',
            duration: 10000,
            prop: { gjsd_per: -percent, distime_per: -percent },
            downside: true,
            no_diff: true,
            override: 2,
        }, me);
        return true;
    }
}
