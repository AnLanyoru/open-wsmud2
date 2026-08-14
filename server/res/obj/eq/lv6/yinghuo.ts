import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '荧惑';
    desc = '长三尺九寸，刀身漆黑如幽冥，刀刃间隐隐有血光流动';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    distime = 60000;
    prop: PropMap = {
        gj: 900,
        str: 150,
        bj_per: 15,
        diff_fy_per: 13,
        add_bjsh_per: 23,
        desc: '激活后5秒内将对敌人造成的伤害吸收为自身气血内力',
    };

    on_use(me: CHARACTER): boolean {
        me.send_room('<hir>$N激活荧惑，幽冥血光沿刀锋流入周身！</hir>');
        me.add_status({
            id: 'eq/yinghuo',
            name: '饮血',
            desc: '造成的伤害会转化为自身气血和内力',
            duration: 5000,
            on_attach(player: CHARACTER): void {
                player.add_event('on_attack_result', absorb_damage);
            },
            on_expire(player: CHARACTER): void {
                player.remove_event('on_attack_result', absorb_damage);
            },
            override: 2,
        });
        return true;
    }
}

function absorb_damage(this: CHARACTER, _target: CHARACTER, _par: DoAttackPar, damage: number): void {
    if (!(damage > 0)) return;
    this.add_hp(damage);
    this.add_mp(damage);
}
