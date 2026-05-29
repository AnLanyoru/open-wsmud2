import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "鳄鱼皮",
    desc: "云梦沼泽巨鳄的皮，很是坚固。",
    unit: "块",
    grade: 1,
    value: 100,
    combined: true
});

this.otype = 3;
this.transable = true;
}
