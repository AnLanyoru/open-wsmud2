import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "list";
this.enter = function (me, arg) {
    var target = me;
    if (arg) {
        target = me.find_obj(arg, me.environment);
        if (!target) {
            return me.notify("这里没有这个人。");
        }
    }
    var selllist = target.sell_list;
    if (target.on_sell) {
        selllist = target.on_sell(me);
    }
    if (!selllist) {
        return me.notify(target.name + "不出售任何东西。");
    }
    var str = ['{"type":"dialog","dialog":"list","selllist":['];
    for (var i = 0; i < selllist.length; i++) {
        if (i > 0) str.push(",");
        var item = selllist[i];

        str.push(item.format_to_sell());
    }
    str.push(']');
    //,items: [
    //items = me.items;
    //if (items) {
    //    for (var i = 0; i < items.length; i++) {
    //        var item = items[i];
    //        if (i > 0) str.push(",");
    //        str.push('{name:"');
    //        str.push(item.color_name);
    //        str.push('",id:"');
    //        str.push(item.id);
    //        str.push('",count:');
    //        str.push(item.count);
    //        str.push(',unit:"');
    //        str.push(item.unit);
    //        str.push('"}');
    //    }
    //}
    str.push(",title:\"");
    str.push(target.name);
    str.push("正在贩卖以下物品：\"");

    str.push(",seller:\"");
    str.push(target.id);
    str.push("\"}");

    me.send(str.join(""));
}
}
