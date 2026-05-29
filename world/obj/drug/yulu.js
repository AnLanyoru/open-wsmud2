import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "九花玉露丸";
    value = 200000;
    desc = "「东邪」黄药师独门灵丹妙药，使用后瞬间恢复你全部气血";
    distime = 60000;
    grade = 4;
    allow_fight = true;
    transable = true;

    on_use(me) {
    if (me.hp == me.max_hp) {
        return me.notify_fail("你现在不需要九花玉露丸。");
    }
    me.add_hp(me.max_hp);
    me.send_room("$N吃下一颗" + this.color_name + "，气色恢复如初。");
}
}
