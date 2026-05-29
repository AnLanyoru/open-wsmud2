import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "火龙筋",
    desc: "坚固耐用的火龙筋，是做鞭子的好材料",
    unit: "块",
    grade: 1,
    value: 200,
    combined: true
});
this.transable = true;
this.otype = 3;
}
