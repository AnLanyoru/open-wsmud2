import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "元晶",
    desc: "高级装备分解出来的蕴含装备附加的神秘力量的晶体，可以用来锻造装备。",
    unit: "块",
    value: 1000000,
    combined: true,
    transable: true,
    grade: 5
});
this.otype = 2;
}
