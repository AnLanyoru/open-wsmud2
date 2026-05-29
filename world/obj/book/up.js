import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "份",
    name: "门派进阶残页",
    desc: "一份秘籍残页，可用来进阶门派武功，(点击技能-武功名称-查看详细-进阶)",
    value: 10000,
    grade: 4
});

this.transable = true;
this.otype = 1;
}
