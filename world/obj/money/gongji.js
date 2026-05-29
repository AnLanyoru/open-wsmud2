import { OBJ } from "../../../os/item/obj.js";

export default function() {
    const UTIL = globalThis.UTIL;
this.inherits(OBJ);
this.set({
    name: "门派功绩",
    desc: "你对门派的贡献，可以在门派管理那里换取各种物资",
    unit: "点",
    value: 0,
    grade:3
});
this.on_receive = function (me) {
    if (!this.count) return false;
    me.add_temp('gongji', this.count);
    me.notify("你获得了" + UTIL.to_c(this.count) + "点<hiy>门派功绩</hiy>。");
    me.set_temp('last_sm', Date.now());
}
}
