import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.unit = "朵";
this.name = "<hiw>百合花</hiw>";
this.grade = 5;
this.value = 1000000;
this.combined = true;
this.desc = "清新脱俗的百合有如婀娜多姿的美丽佳人";
this.on_use = function (me) {
    me.notify("<hiw>你拿起一朵百合花轻轻一嗅，顿时神清气爽，精气十足。</hiw>");
    me.add_temp("ad_jl", 100);
    me.notify("<hiy>你增加了100点精力。</hiy>");
}
}
