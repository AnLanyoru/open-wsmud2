import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "玲珑火芝";
    grade = 3;
    desc = "生长在火山中心的一种灵芝，食用后使人增加内力上限";
    value = 980000;
    transable = true;

    on_use(me) {

    me.send_room("<hir>$N拿出一颗玲珑火芝，一口气吞了下去。</hir>");
    var sx = me.random(me.query_skill("force") / 5) + 100;
    me.limit_mp += sx;
    me.notify("<red>你感觉一股热流顺着喉咙涌到全身，你的经脉仿佛都被拓宽了。</red>");
    me.notify("<hiw>你的内力上限增加了" + sx + "。</hiw>");
}
}
