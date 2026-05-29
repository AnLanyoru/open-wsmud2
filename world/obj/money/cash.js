import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "元宝",
    desc: "这是一锭官银",
    unit: "个",
    value: 100,
    grade:5
});
this.on_receive = function (me) {
    if (!this.count) return false;
    me.add_cash(this.count, "排行榜收取");
}
}
