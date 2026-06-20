import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "鹰刀";
    desc = "破碎虚空后遗留的神器，里面蕴含着无上的武学至理";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 870,
        gj_per: 10,
        add_bjsh_per: 30,
        add_sh_per: 12,
        diff_fy_per: 10,
    };
    // Special effects: 沟通天地之力攻击你附近敌人，命中后昏迷3秒
}
