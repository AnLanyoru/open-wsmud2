import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "帮派积分",
    desc: "可用于升级帮派和设施",
    unit: "点",
    grade: 2,
    value: 1
});
}
