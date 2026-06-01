import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "解毒丹";
    value = 1000;
    desc = "这是螣蛇血清制成的解药，可以解螣蛇毒";
    distime = 30000;
    grade = 5;
    allow_fight = true;
    transable = true;

    on_use(me) {
    if (me.query_status('shedu')) {
        me.send_room('<hig>$N吞下一颗解毒丹，脸上的灰白死气终于褪去。</hig>');
        me.remove_status('shedu', true);
        return;
    }
    return me.notify_fail('你没中蛇毒，用不着吃解药。');
}
}
