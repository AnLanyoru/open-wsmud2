import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "龙纹冠",
    desc: "用黑龙额骨打磨成型的头饰",
    unit: "顶",
    grade: 2,
    eq_type: EQUIP_TYPE.HEAD,
    hole_count: 1,
    prop: {
        fy: 20,
        int: 10,
        dazuo_per: 8
    }
});
this.group_name = "lm2";
this.group_prop = function (count) {
    if (count == 3) {
        return {
            int: 10
        };
    } else if (count == 5) {
        return {
            lianxi_per: 15,
            dazuo_per: 15
        };
    }
}
}
