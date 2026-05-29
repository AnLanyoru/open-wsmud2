import { OBJ } from "../../../os/item/obj.js";

export default function() {
    const UTIL = globalThis.UTIL;
this.inherits(OBJ);
this.set({
    name: "潜能",
    desc: "使用后获得一万点潜能",
    unit: "万点",
    value: 0,
    grade: 1
});
this.on_use = function (me) {
    me.add_exp(0, 10000);
}

// this.unit_name = function (count) {
//     count = count ?? this.count;
//     return UTIL.to_c(count) + "万点<hig>潜能</hig>";
// }
}
