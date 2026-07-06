import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type {PropMap} from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "魔龙战甲";
    desc = "魔龙皮所制的甲胄，防御力惊人。";
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CLOTH;
    group_name = "zhanshen5";
    prop: PropMap = {
        fy: 550,
        fy_per: 10,
        str: 50,
        diff_sh_per: 10,
        diff_bj: 10,
    };

    group_prop(count: number): PropMap | void {
        if (count >= 4) return {gj_per: 10, mz_per: 10, zj_per: 10, ds_per: 10, fy_per: 10};
    }
}
