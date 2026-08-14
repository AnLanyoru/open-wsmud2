import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '血刀';
    desc = '血刀老祖的武器，刀身暗红，犹有血迹！';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 430,
        str: 65,
        mz: 400,
        add_sh_per: 5,
    };
    do_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (par.no_weapon) return 0;
        const attack = 700 + Math.max(0, this.level - 1) * 300;
        me.add_status({
            id: 'eq/xiedao',
            name: '血魔',
            desc: '血刀吸取敌人鲜血，强化自身攻击',
            duration: 10000,
            prop: { gj: attack },
            override: 2,
            only_combat: true,
        });
        return 0;
    }
}
