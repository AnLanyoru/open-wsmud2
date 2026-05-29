import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "buy";
    regex = /^(?:(\d+)\s)?(\w+)(?:\s+from\s+(.+?))?$/;

    enter(me, count, objid, from) {
    var target;
    if (from) {
        target = me.find_obj(from, me.environment);
        if (!target) {
            return me.notify("你要从哪买东西？");
        }
        if (target == me) {
            return me.notify("你自己的东西还用得着买吗？");
        }
    }
    var buy_count = 1;
    if (count) buy_count = parseInt(count);
    if (!(buy_count > 0)) return;
    if (!target) return;
    var selllist = target.sell_list;
    if (target.on_sell) {
        selllist = target.on_sell(me, buy_count, objid);
    }
    if (selllist === true) return;
    if (!selllist) {
        return me.notify(target.name + "不出售任何东西。");
    }
    var sellitem = null;
    for (var i = 0; i < selllist.length; i++) {
        if (selllist[i].id == objid) {
            sellitem = selllist[i];
            break;
        }
    }
    if (!sellitem) return me.notify(target.name + "不出售这个东西。");
    if (!sellitem.combined && buy_count > 1) {
        buy_count = 1;
        me.notify("<cyn>不可堆叠道具最大购买数量1</cyn>");
    }
    if (me.is_full(sellitem.combined ? 0 : buy_count)) {
        return me.notify("你拿不下那么多东西。");
    }
    var need_money = sellitem.value * buy_count;
    if (need_money > (me.money || 0)) {
        return me.notify("你没有那么多的钱。");
    }
    if (target.before_sell_item) {
        if (target.before_sell_item(me, sellitem, buy_count) === false)
            return;
    }
    if ((!target.is_player && sellitem.count == -1)) {

        me.money -= need_money;
        me.add_temp('money1', need_money, UTIL.diff_time());
        sell_obj = me.add_obj(sellitem.path, buy_count);
        if (sell_obj) {
            me.send_room("$N从$n购买了" + UTIL.to_c(buy_count) + sell_obj.unit + sell_obj.color_name + "。", target);

            if (target.on_sell_item) target.on_sell_item(me, sell_obj, count);
        }
    } else {
        if (sellitem.count >= buy_count) {
            sellitem.count -= buy_count;
            me.money -= need_money;

            me.add_temp('money1', need_money, UTIL.diff_time());
            sell_obj = me.add_obj(sellitem.path, buy_count);
            if (sell_obj) {
                me.send_room("$N从$n购买了" + UTIL.to_c(buy_count) + sell_obj.unit + sell_obj.color_name + "。", target);
            }

            me.send('{type:"dialog",dialog:"list",id:"' + sellitem.id + '",sell:' + buy_count + '}');

            if (target.on_sell_item) target.on_sell_item(me, sell_obj, count);
        } else {
            return me.notify(target.name + "没有那么多的" + sellitem.color_name + "买给你。");
        }
        //玩家售卖
    }
    // me.send('你给他' + UTIL.moneyToStr(need_money) + "。");
}
}

const UTIL = globalThis.UTIL;
