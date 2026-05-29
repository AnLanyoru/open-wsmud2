import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "块",
    name: "木头",
    desc: "木头人身上掉下来的一块木头",
    value: 0
});
}
