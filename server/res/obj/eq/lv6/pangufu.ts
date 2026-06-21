import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "盘古斧";
    desc = "传说中盘古开天辟地时候使用的一把斧头";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop: PropMap = {
        gj: 910,
        str: 250,
        add_sh_per: 12,
        diff_fy_per: 20,
        add_bjsh_per: 50,
        gjsd: -1000,
        desc: "命中敌人后降低其10%战斗属性，可叠加5层，敌方每10%效果抵抗降低1%效果",
    };

    do_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
        // 基础降低效果10%，敌方每10%效果抵抗降低1%效果
        if (par.no_weapon) return 0;

        // 内置CD 0.5秒，防止高攻速瞬间叠满
        const cdKey = "pangufu_cd_" + target.id;
        if (me.query_temp<number>(cdKey)) return 0;

        let effPer = 10;
        const diffDownsidePer = target.query_prop('diff_downside_per') || 0;
        effPer = effPer - Math.floor(diffDownsidePer / 10);
        if (effPer <= 0) return 0;
        me.send_room("<hir>$N的$w以开天辟地之势镇压$n</hir>", target);
        if (target.add_status({
            id: "pangufu",
            name: "镇压",
            desc: "你的战斗属性被盘古斧压制了",
            max_count: 5,
            prop: {
                gj_per: -effPer,
                fy_per: -effPer,
                mz_per: -effPer,
                ds_per: -effPer,
                zj_per: -effPer,
            },
            duration: 10000,
            count: 1,
            downside: true,
            no_diff: true,
            override: 1,
            only_combat: true,
        })) {
            me.set_temp(cdKey, 1, 500);
        }

        return 0;
    }
}
