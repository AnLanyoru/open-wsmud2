import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "朵";
    name = "<hiw>百合花</hiw>";
    grade = 5;
    value = 1000000;
    combined = true;
    desc = "清新脱俗的百合有如婀娜多姿的美丽佳人";

    on_use(me) {
    me.notify("<hiw>你拿起一朵百合花轻轻一嗅，顿时神清气爽，精气十足。</hiw>");
    me.add_temp("ad_jl", 100);
    me.notify("<hiy>你增加了100点精力。</hiy>");
}
}
