import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '轩辕剑';
    desc =
        '传说中的神器，由众神采首山之铜为黄帝所铸，以此击杀蚩尤，剑身一面刻日月星辰，一面刻山川草木。';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 780,
        str: 150,
        mz_per: 20,
        add_sh_per: 12,
        diff_fy_per: 12,
    };
    // 命中后增加你的全部战斗属性10%，可叠加10层
    do_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (par.no_weapon) return 0;

        // 内置CD 0.5秒，防止高攻速瞬间叠满
        const cdKey = 'xuanyuanjian_cd_' + me.id;
        if (me.query_temp<number>(cdKey)) return 0;

        const effPer = 10;
        me.send_room('<hir>$N的轩辕剑绽放出耀眼光芒，$P战力大增！</hir>');
        if (
            me.add_status({
                id: 'xuanyuanjian',
                name: '圣道',
                desc: '你的全部战斗属性提升了',
                max_count: 10,
                prop: {
                    gj_per: effPer,
                    fy_per: effPer,
                    mz_per: effPer,
                    ds_per: effPer,
                    zj_per: effPer,
                },
                duration: 10000,
                count: 1,
                override: 1,
                only_combat: true,
            })
        ) {
            me.set_temp(cdKey, 1, 500);
        }

        return 0;
    }
}
