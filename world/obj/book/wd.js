import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "份",
    name: "武道残页",
    desc: "一本武功秘籍碎片，需要十份残页就可以合成一本完整的武道秘籍。",
    combine_to: "book/wudao",
    combine_count: 10,
    grade: 5
});

this.otype = 1;
}
