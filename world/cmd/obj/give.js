import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "give";
    regex = /^(\w+)(?:\s+(\w+))?\s+(\w+)$/;

    enter(player, target, count, objid) {
        target = player.find_obj(target, player.environment);
        if (!target || !target.hp) return player.notify("你要给谁东西？");
        if (target.is_player && player.master != target.id) return player.notify("不能给玩家控制的人物东西。");


        if (objid == "money") {
            if (!count) return player.notify("你要给" + target.name + "多少钱？");
            count = parseInt(count);
            if (count <= 0) return player.notify("你要给" + target.name + "多少钱？");
            if (count > player.money) return player.notify("你身上没有那么多的钱给" + target.name + "。");
            if (target.on_accept && target.on_accept(player, objid, count)) {
                player.money -= count;
                //target.money = target.money || 0;
                //target.money += count;

                // player.add_temp('money1', count, UTIL.diff_time());
                player.send_room("$N给了$n" + UTIL.moneyToStr(count) + "。", target);
                return;
            }
            return player.notify(target.name + "不要你的钱。");
        } else if (objid == "cash") {
            if (!count) return player.notify("你要给" + target.name + "多少元宝？");
            if (count <= 0) return player.notify("你要给" + target.name + "多少元宝？");
            if (count > player.cash_money) return player.notify("你身上没有那么多的元宝给" + target.name + "。");
            if (target.on_accept && target.on_accept(player, objid, count)) {
                return player.add_cash(-count, "给" + target.name);
            }
            return player.notify(target.name + "不要你的钱。");
        }

        var obj = player.find_obj(objid);
        if (!obj) {
            return player.notify("你要给" + target.name + "什么东西？");
        }
        if (!count) count = 1;
        else if (count === 'all')
            count = obj.count;
        else
            count = parseInt(count);
        if (!(count > 0)) return;
        if (obj.count < count) {
            return player.notify("你没有那么多的" + obj.name + "。");
        }
        if (target.master == player.id || target.id == player.master) {
            if (target.is_full()) return player.notify(target.name + "身上东西太多了。");
            obj = player.remove_obj(obj, count);
            if (obj) {
                target.add_obj(obj);
                player.send_room("$N给了$n" + UTIL.to_c(count) + obj.unit + obj.color_name + "。", target);
            }
            return;
        }
        if (target.on_accept && target.on_accept(player, obj, count)) {
            obj = player.remove_obj(obj, count);
            if (obj) {
                player.send_room("$N给了$n" + UTIL.to_c(count) + obj.unit + obj.color_name + "。", target);
            }
        }
    }
}

const UTIL = globalThis.UTIL;
