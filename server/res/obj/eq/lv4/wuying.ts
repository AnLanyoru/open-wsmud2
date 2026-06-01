import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "无影披风";
    desc = "一件轻若无物的墨色披风，披上后身影便如融入暗影般消散无形。";
    unit = "件";
    grade = 4;
    eq_type = EQUIP_TYPE.CAPE;
    value = 100000;

    eq_msg = "$N的身影如轻烟般消散在空气之中。";
    uneq_msg = "$N的身影从空气中缓缓浮现。";

    on_eq(me) {
        me.set_temp("hidden", 1);
    }

    on_uneq(me) {
        me.remove_temp("hidden");
    }
}
