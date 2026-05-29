import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "本";
    name = "武道";
    desc = "一本神秘的武功秘籍，据说里面记载了很多已经失传的武功秘辛。";
    grade = 5;
    combined = true;
    otype = 1;

    lingwu(me, p) {
    me.do_command("lingwu");
}
}
