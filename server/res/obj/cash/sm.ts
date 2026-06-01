import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "副本补给包";
    desc = "包含328个扫荡符，18个天师符，100精力";
    unit = "个";
    value = 0;
    grade = 5;

    on_open(me) {
    var result = [
        {
            obj: "cash/saodang",
            count: 328
        },
        {
            obj: "cash/tianshifu",
            count: 18
        },
        {
            obj: "cash/jing#4"
        }
    ];

    return OBJ.create_by_odds(result);
}
}
