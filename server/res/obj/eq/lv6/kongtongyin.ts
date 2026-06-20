import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "方";
    name = "崆峒印";
    desc = "东海氐人国世代守护的上古神器；印身雕刻五方天帝，玉龙盘绕其上";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop = {
        fy: 200,
        str: 100,
        mz: 160,
        diff_fy_per: 10,
        desc: "激活后可以镇压敌人的下个绝招，冷却60秒"
    };
}
