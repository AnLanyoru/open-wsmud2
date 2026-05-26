this.inherits(COMMAND);
this.command = "sell";
this.regex = /^(?:(\d+)\s)?(\w+)(?:\s+to\s+(.+?))?$/;
this.enter = function (me, count, objid, to) {
    var target;
    if (to) {
        target = me.find_obj(to, me.environment);
        if (!target) {
            return me.notify("你要卖东西给谁？");
        }
        if (target == me) {
            return me.notify("东西就在你身上，别折腾了。");
        }
        if (!target.sell_list) {
            return me.notify(target.name + "不是商人，不收购任何东西。");
        }
    }
    // else {
    //     var env = me.environment;
    //     if (!env) return;
    //     for (var i = 0; i < env.items.length; i++) {
    //         if (env.items[i].sell_list) {
    //             target = env.items[i];
    //             break;
    //         }
    //     }
    //     if (!target) {
    //         return me.notify("这里没有商人。");
    //     }
    // }
    if (objid === "all") {
        var str = [];
        let sum_money = 0;
        for (var i = 0; i < me.items.length; i++) {
            var item = me.items[i];
            if (!item.transable || item.is_locked) continue;
            if (!item.grade && !item.path.startsWith("res/cao") &&
                !item.path.startsWith("book/book") && !item.path.startsWith("res/yu")) {
                var money = parseInt(item.count * item.value);
                if (!(money > 0)) continue;

                me.items.splice(i, 1);
                sum_money += money;

                i--;
                str.push("你卖掉了" + item.unit_name() + "。");
                // me.add_temp('money2', money, UTIL.diff_time());
            }
        }
        if (str.length) {
            if (!me.is_player && me.master) {
                let user = WORLD.getUser(me.master);
                if (user) user.add_money(sum_money);
            } else {
                me.add_money(sum_money);
            }
            me.do_command("pack");
            me.notify(str.join("\n"));
            me.notify('你将身上的杂物卖了' + UTIL.moneyToStr(sum_money) + "。");
        } else {
            me.notify("<hig>你身上的杂物已经清理干净了。</hig>");
        }

        return;
    }
    var obj = me.find_obj(objid);
    if (!obj) {
        return me.notify("你没有这件东西。");
    }
    if (obj.is_locked) {
        return me.notify(obj.color_name + "处于锁定状态，无法丢弃，贩卖，分解。");
        //  me.send_commands('lockobj ' + obj.id, '解除锁定');
    }
    if (obj.is_equipment) {
        if (obj.level > 3)
            return me.notify(obj.color_name + "已经精炼，清理精炼后才可以贩卖。");
        if (obj.st_prop && obj.st_prop.length > 0)
            return me.notify(obj.color_name + "已经镶嵌宝石，清理宝石后才可以贩卖。");
    }

    if (!obj.transable) return me.notify("这个东西不能卖。");
    if (!(obj.value > 0)) return me.notify("这个东西不值钱。");

    var sell_count = obj.count;
    if (count) sell_count = parseInt(count);
    if (!(sell_count > 0)) return;
    if (sell_count > obj.count) return me.notify("你身上没有这么多的" + obj.color_name + "。");

    const sell_money = Math.floor(obj.value * sell_count);
    if (!me.is_player && me.master) {
        let user = WORLD.getUser(me.master);
        if (user) user.add_money(sell_money);
    } else {
        me.add_money(sell_money);
    }
    var sell_obj = me.remove_obj(obj, sell_count);

    me.send("你卖掉了" + obj.unit_name(sell_count) + "。");
    // me.send('你获得' + UTIL.moneyToStr(sell_money) + "。");
    WORLD.add_recover_obj(me, sell_obj, 1);
    if (target && target.on_user_sell) {
        target.on_user_sell(me, obj, sell_count);
    }
}