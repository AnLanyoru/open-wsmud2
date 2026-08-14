import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '太岁';
    desc = '天下百万共剑主监兵佩剑，锈迹斑斑，但锋锐之感直逼面庞';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 900,
        str: 150,
        gj_per: 13,
        gjsd_per: 20,
        diff_fy_per: 15,
        desc: '兵解：自身气血内力归一，对敌人造成相应伤害',
    };

    on_use(me: CHARACTER): boolean {
        const target = me.query_enemy();
        if (!target) return me.notify_fail('你现在没有战斗目标。');
        const damage = Math.max(0, me.hp - 1) + Math.max(0, me.mp - 1);
        if (!damage) return false;
        me.hp = 1;
        me.mp = 1;
        me.send_room('<hir>$N横剑兵解，气血内力尽数化作一道杀光贯入$n体内！</hir>', target);
        target.damage3(damage, me);
        if (target.hp <= 0) {
            target.die(me);
            target.end_fight();
        }
        return true;
    }
}
