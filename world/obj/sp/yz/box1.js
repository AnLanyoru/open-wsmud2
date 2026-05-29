import { OBJ } from "../../../../os/item/obj.js";

export default class extends OBJ {
    name = "小箱子";
    desc = "这是在崔员外家找到的一个小箱子，不知道里面放了些了什么。";
    unit = "个";
    value = 0;
    grade = 2;

    on_open(me) {
    return OBJ.create_by_odds([{
        obj: "money/gold",
        min: 1,
        max:10
    }, {
        obj: ["book/book#unarmed", "book/book#parry", "book/book#dodge", "book/book#sword"],
        odds: 10000
        }, {
            obj: ["st/st_blu", "st/st_red", "st/st_gre", "st/st_yel"],
            min: 1,
            max: 3,
            odds: 5000
    }, {
        obj: ["eq/lv1/pifeng"],
        odds: 2000
    }]);
}
}
