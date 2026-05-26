this.inherits(COMMAND);
this.command = "escape";
this.enter = function (me) {

    if (!me.fight_type) {
        return me.notify("你现在没有在战斗，逃跑干嘛？");
    }
    me.do_escape();
}
