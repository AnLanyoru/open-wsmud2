import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "块";
    name = "熊胆";
    grade = 1;
    desc = "一块新鲜的熊胆，还冒着热气";
    value = 1000;
    transable = true;

    on_use(me) {
    if (me.max_mp >= me.limit_mp + me.query_prop("limit_mp")) {
        return me.notify_fail("你觉得你的经脉容纳不了再多的内力了。");
    }
    me.send_room("<hiw>$N拿出一块熊胆，三下五除二得就吞了下去。</hiw>");
    me.add_maxmp(40);
}
}
