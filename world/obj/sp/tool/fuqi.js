import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "休书",
    desc: "这是一封休书",
    unit: "封",
    value: 0,
    grade: 3
});
this.on_create = function (path, par) {
    if (par) {
        this.target = par.substr(1);
    }
}

this.on_receive = function (me) {
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
