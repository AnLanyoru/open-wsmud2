import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "扫荡符",
    desc: "副本通关完成度100%后，可以快速完成副本",
    unit: "个",
    value: 10000,
    grade: 2
});
}
