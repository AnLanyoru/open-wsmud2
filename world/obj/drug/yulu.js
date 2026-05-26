this.inherits(OBJ);
this.unit = "颗";
this.name = "九花玉露丸";
this.value = 200000;
this.desc = "「东邪」黄药师独门灵丹妙药，使用后瞬间恢复你全部气血";
this.distime = 60000;
this.grade = 4;
this.allow_fight = true;
this.transable = true;
this.on_use = function (me) {
    if (me.hp == me.max_hp) {
        return me.notify_fail("你现在不需要九花玉露丸。");
    }
    me.add_hp(me.max_hp);
    me.send_room("$N吃下一颗" + this.color_name + "，气色恢复如初。");
}