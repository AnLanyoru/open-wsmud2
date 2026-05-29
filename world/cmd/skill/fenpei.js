import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "fenpei";
this.allow_fight = false;
this.enter = function (me) {
    var fen = me.query_temp("fenpei");
    if (!fen) return me.notify("你目前没有可以分配的先天属性。");
    if (fen <= 0) return me.notify("你目前的可分配属性是"+fen+"，无法分配。");
    me.notify("请说出你的先天属性，每项15-30，总计" + fen + "，比如:10 0 0 10");
    me.wait_input = readnumber;
}
function readnumber(me, cmd) {
    var fen = me.query_temp("fenpei");
    if (!cmd) return me.notify("请说出你要增加的先天属性，总计" + fen +"，比如:10 0 0 10");
    var ss = cmd.split(' ');
    if (ss.length != 5) return me.notify("请说出你要增加的先天属性，总计" + fen +"，比如:10 0 0 10");
    var str = parseInt(ss[1]);
    var con = parseInt(ss[2]);
    var dex = parseInt(ss[3]);
    var int = parseInt(ss[4]);
    if (str + con + dex + int != fen) return me.notify("四项总计需要是" + fen+"，请重新调整");
    if (str < 0 || con < 0 || dex < 0 || int < 0) return me.notify("单项的值需要大于0");
    me.set_temp("re_str", str);
    me.set_temp("re_con", con);
    me.set_temp("re_dex", dex);
    me.set_temp("re_int", int);

    me.notify("增加先天属性设置为臂力：" + str + "，根骨：" + con + ",身法：" + dex + ",悟性:" + int + "，是否确认？");
    me.send_commands("ok", "确认", "cancle", "重新设置");
    me.wait_input = checkResult;
}
function checkResult(me, str) {
    if (str == "ok") {
        me.str +=( me.query_temp("re_str") || 0);
        me.con += (me.query_temp("re_con") || 0);
        me.int += (me.query_temp("re_int") || 0);
        me.dex += (me.query_temp("re_dex") || 0);
        me.recount();
        me.notify("属性调整完成");
        me.remove_temp("fenpei");
        me.wait_input = null;
        me.remove_temp("re_dex");
        me.remove_temp("re_con");
        me.remove_temp("re_int");
        me.remove_temp("re_dex");
    } else {
        var fen = me.query_temp("fenpei");
        if (!fen) return;
        me.wait_input = readnumber;
        me.notify("请说出你要增加的先天属性(臂力 根骨 身法 悟性)，总计" + fen +"，比如:10 0 0 10");
    }
}
}
