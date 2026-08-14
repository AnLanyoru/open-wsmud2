import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '副';
    name = '长庚';
    desc = '一副古朴的拳套，毫无光泽，只是望着便有肃杀之感';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.NONE;
    prop: PropMap = {
        desc: '战意：命中后增加5%破防和最终伤害',
    };

    do_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (!par.no_weapon) return 0;
        me.add_status({
            id: 'eq/changgeng',
            name: '战意',
            desc: '长庚激起战意，破防和最终伤害提升',
            duration: 10000,
            prop: { diff_fy_per: 5, add_sh_per: 5 },
            override: 2,
            only_combat: true,
        });
        return 0;
    }
}
