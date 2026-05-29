import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "动物皮毛",
    desc: "品质一般的动物皮毛。",
    unit: "块",
    value: 10,
    combined: true
});
this.transable = true;
}
