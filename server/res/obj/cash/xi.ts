import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "洗髓丹";
    desc = "使用后可以重新设置你的先天属性";
    grade = 3;
    value = 0;

    on_use(me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    var count = me.str + me.con + me.dex + me.int;
    var max = 30 + count - 80;
    me.notify("请说出你的先天属性(臂力 根骨 身法 悟性)，每项15-" + max + "，总计" + count + "，比如:20 20 20 20");
    me.wait_input = readnumber;
    me.send_commands("quxiao", "取消使用");
    return false;
}
}

function readnumber(me, cmd) {
    var count = me.str + me.con + me.dex + me.int;
    var max = 30 + count - 80;
    var nitify = "请说出你的先天属性(臂力 根骨 身法 悟性)，每项15-" + max + "，总计" + count + "，比如:20 20 20 20";
    if (!cmd) {
        return me.notify(nitify);
    }
    if (cmd == 'quxiao') {
        me.wait_input = null;
        me.notify('已取消使用洗髓丹。');
        return;
    }
    var ss = cmd.split(' ');
    if (ss.length != 5) return me.notify(nitify);
    var str = parseInt(ss[1]);
    var con = parseInt(ss[2]);
    var dex = parseInt(ss[3]);
    var int = parseInt(ss[4]);
    if (!(str > 14 && str <= max)) return me.notify("臂力需要在15-" + max + "之间。");
    if (!(con > 14 && con <= max)) return me.notify("根骨需要在15-" + max + "之间。");
    if (!(dex > 14 && dex <= max)) return me.notify("身法需要在15-" + max + "之间。");
    if (!(int > 14 && int <= max)) return me.notify("悟性需要在15-" + max + "之间。");
    if (str + con + dex + int != count) {
        return me.notify("总计需要是" + count + "，请重新设置：");
    }


    me.set_temp("re_str", str);
    me.set_temp("re_con", con);
    me.set_temp("re_dex", dex);
    me.set_temp("re_int", int);

    me.notify("属性调整为臂力：" + str + "，根骨：" + con + ",身法：" + dex + ",悟性:" + int + "，是否确认？");
    me.send_commands("ok", "确认", "cancle", "重新设置");
    me.wait_input = checkResult;
}
function checkResult(me, str) {
    if (str == "ok") {
        var obj = me.find_obj_bypath('cash/xi');
        if (!obj || !obj.count) {
            return me.notify('你身上没有洗髓丹。');
        }
        me.remove_obj(obj, 1);
        me.str = me.query_temp("re_str");
        me.con = me.query_temp("re_con");
        me.int = me.query_temp("re_int");
        me.dex = me.query_temp("re_dex");
        me.recount();
        me.notify("属性调整完成");
        me.wait_input = null;
        me.remove_temp("re_dex");
        me.remove_temp("re_con");
        me.remove_temp("re_int");
        me.remove_temp("re_dex");
    } else {
        me.wait_input = readnumber;
        var count = me.str + me.con + me.dex + me.int;
        var max = 30 + count - 80;
        me.notify("请说出你的先天属性(臂力 根骨 身法 悟性)，每项15-" + max + "，总计" + count + "，比如:20 20 20 20");
        me.send_commands("quxiao", "取消使用");
    }
}
