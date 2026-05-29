import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { UTIL } from "../../../os/util/util.js";

export default class extends COMMAND {
    command = "unjinglian";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, oid) {
    if (oid) {
        var obj = me.find_obj(oid);
        if (!obj) {
            return me.notify("你身上没有这件装备。");
        }
        var orglevel = obj.level;
        if (!(orglevel > 0)) return me.notify("你的" + obj.color_name + "已经是初始等级了。");
        let money = MONEYS[obj.grade];

        if (!(money > 0) || me.money < money) return me.send('你身上的钱不够。');
        me.add_money(-money);
        obj.level_up(0);
        me.notify("你的" + obj.color_name + "已经是初始等级了。");
        me.items_changed(obj);
        WORLD.STATS.updateWeapon(me, obj);

        if (orglevel > 0) {
            let count = (Math.pow(2, orglevel + 1) - 2) * obj.grade;
            var item = me.add_obj("st/xuanjing", count);
            me.send("你获得" + item.unit_name(count) + "。");
        }

    } else {
        var str = ["{type:\"cmds\",items:["];
        for (var i = 0; i < me.items.length; i++) {
            var item = me.items[i];
            if (!item.level || !item.is_equipment) {
                continue;
            }
            if (str.length > 1) str.push(",");

            str.push("{cmd:\"unjinglian ");
            str.push(item.id);
            str.push("\",name:\"", UTIL.moneyToStr(MONEYS[item.grade]), "清除精炼");
            str.push(item.color_name);
            str.push("\"}");
        }
        if (str.length == 1) {
            return me.notify("铁匠瞄了你一眼说道：你身上没有精炼过的装备。");
        }
        str.push("]}");

        me.notify("铁匠说道：取消精炼后装备的等级变为初始等级，退回全部玄晶，不论精炼等级统一收费。");
        me.notify(str.join(""));
    }
}
}

const MONEYS = [10, 100, 1000, 5000, 10000, 20000, 100000];
