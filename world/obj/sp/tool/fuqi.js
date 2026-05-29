import { OBJ } from "../../../../os/item/obj.js";

export default class extends OBJ {
    name = "休书";
    desc = "这是一封休书";
    unit = "封";
    value = 0;
    grade = 3;

    on_create(path, par) {
    if (par) {
        this.target = par.substr(1);
    }
}
    on_receive(me) {
    if (!this.target) return;
    if (me.query_temp("wife") == this.target) {
        var name = me.query_temp("wife_n");
        me.remove_temp("wife");
        me.remove_temp("wife_n");
        me.commands_json = null;
        me.notify("你和" + name + "的夫妻关系解除了。");
        me.add_title("", "mar");
        me.set_temp("marry_leave", 1, 7 * 24 * 3600000);
    } else if (me.query_temp("husband") == this.target) {
        var name = me.query_temp("husband_n");
        me.remove_temp("husband");
        me.remove_temp("husband_n");
        me.commands_json = null;
        me.notify("你和" + name + "的夫妻关系解除了。");

        me.add_title("", "mar");
        me.set_temp("marry_leave", 1, 7 * 24 * 3600000);
    }
}
}
