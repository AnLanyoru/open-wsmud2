import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '盘古斧';
    desc = '传说中盘古开天辟地时候使用的一把斧头，可以作为大剑使用';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop: PropMap = {
        gj: 910,
        str: 250,
        add_sh_per: 12,
        diff_fy_per: 20,
        add_bjsh_per: 50,
        gjsd: -1000,
        desc: '命中后降低对方战斗属性30%',
    };

    /** 融合等级：1=不计算负抗，2=每10点负抗降低5%效果，3=每10点负抗降低1%效果。 */
    fusion_level = 1;

    on_create(path?: string, par?: string): void {
        const level = par ? parseInt(par.slice(1), 10) : 1;
        this.fusion_level = level >= 1 && level <= 3 ? level : 1;
        if (this.fusion_level === 2) this.prop.desc = '命中后降低对方战斗属性，每10点负面抵抗降低5%效果';
        else if (this.fusion_level === 3) this.prop.desc = '命中后降低对方战斗属性，每10点负面抵抗降低1%效果';
        else this.prop.desc = '命中后降低对方战斗属性30%';
        EQUIPMENT.prototype.on_create.apply(this);
    }

    do_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
        if (par.no_weapon) return 0;

        // 残缺基础值为30%，每次强化增加1%；负抗只削减效果，不缩短持续时间。
        const basePer = 30 + this.level;
        const resistance = Math.floor(target.query_prop('diff_downside_per') / 10) * 10;
        let effPer = basePer;
        if (this.fusion_level === 2) effPer = Math.floor(basePer * (1 - resistance / 200));
        else if (this.fusion_level === 3)
            effPer = Math.floor(basePer * (1 - resistance / 1000));
        if (effPer <= 0) return 0;

        me.send_room('<hir>$N的$W似开天辟地般自虚空划出一道笔直弧线，将$n身体撕扯的支离破碎</hir>', target);
        target.add_status({
            id: 'eq/pgf',
            name: '残缺',
            desc: '你的身体被盘古斧撕裂，战斗能力大幅下降',
            prop: {
                gj_per: -effPer,
                gjsd_per: -effPer,
                distime_per: -effPer,
                diff_fy_per: -effPer,
                diff_sh_per: -effPer,
            },
            duration: 10000,
            downside: true,
            no_diff: true,
            override: 2,
            only_combat: true,
        });

        return 0;
    }
}
