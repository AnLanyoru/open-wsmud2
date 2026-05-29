import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "龙纹靴",
    desc: "鞋面用黑龙筋编织出防滑纹路",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.SHOES,
    hole_count: 1,
    prop: {
        fy: 21,
        int: 10
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
