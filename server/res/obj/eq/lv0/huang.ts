import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "皇袍";
    desc = "这是一黄色的长袍，上面的纹路似一条神龙游弋于天地之间，富丽堂皇之余透露出大气磅礴之势。";
    value = 100000000;
    eq_type = EQUIP_TYPE.CLOTH;
    prop = {
    fy: 99
};
}

