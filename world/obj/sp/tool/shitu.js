import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "师徒关系解除通知",
    desc: "",
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
    if (me.query_temp("tudi") == this.target) {
        var name = me.query_temp("tudi_n");
        me.remove_temp("tudi");
        me.remove_temp("tudi_n");
        me.commands_json = null;
        me.notify("你和" + name + "的师徒关系自动解除了。");
        me.set_temp("st_leave", 1, 3600000 * 24 * 7);
    } else if (me.query_temp("shifu") == this.target){
        var name = me.query_temp("shifu_n");
        me.remove_temp("shifu");
        me.remove_temp("shifu_n");
        me.commands_json = null;
        me.notify("你和" + name + "的师徒关系自动解除了。");
        me.set_temp("st_leave", 1, 3600000 * 24 * 7);
    }  
}
}
