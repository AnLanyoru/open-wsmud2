import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { UTIL } from "../../../os/util/util.js";

export default class extends COMMAND {
    command = "greet";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (arg == "master") {
        if (!me.query_temp("shifu")) {
            return me.notify("你还没有师父。");
        }
        if (me.query_temp("greet1")) {
            return me.notify("你今天已经请安过了。");
        }
        var user = WORLD.getUser(me.query_temp("shifu"));
        if (!user) return me.notify("没有这个玩家，或者不在线。");
        if (user.query_temp("tudi") != me.id) return me.notify("你不是" + user.name + "徒弟，无法请安。");
        me.notify("你对" + user.name + "说道：师父好。");
        user.notify("<hic>" + me.name + "恭恭敬敬的向你打招呼：师父好。</hic>");
        me.add_exp(10000, 10000);
        me.set_temp("greet1", 1, UTIL.diff_time());
    } else {
        var count = parseInt(arg);
        if (!(count > 0 && count < 100)) return me.notify("数量错误");

        if (!me.query_temp("wife") && !me.query_temp("husband")) {
            return me.notify("你还没有结婚。");
        }
        if (me.query_temp("greet2")) {
            return me.notify("你本周已经送过花了。");
        }
        var user = WORLD.getUser(me.query_temp("wife") || me.query_temp("husband"));
        if (!user) return me.notify("没有这个玩家，或者不在线。");
        if (me.money < 1000 * count) {
            return me.notify("你身上的钱不够，买不起花。");
        }
        if (me.query_temp("wife")) {
            if (user.query_temp("husband") != me.id) return me.notify("你不是" + user.name + "丈夫，无法送花。");
            me.money -= 1000 * count;
            me.notify("你购买了" + UTIL.to_c(count) + "朵玫瑰花送给你妻子" + user.name + "。");
            me.set_temp("greet2", 1, UTIL.diff_week_time());
            COMMAND.DO("send", user.id, {
                content: "你的老公" + me.name + "送给你" + UTIL.to_c(count) + "朵玫瑰花。",
                attach: [
                    {
                        obj: "money/hua",
                        count: count
                    }
                ]
            });

        }
        else {
            if (user.query_temp("wife") != me.id) return me.notify("你不是" + user.name + "妻子，无法送花。");
            me.money -= 10000 * count;
            me.notify("你购买了" + UTIL.to_c(count) + "朵玫瑰花送给你丈夫" + user.name + "。");
            me.set_temp("greet2", 1, UTIL.diff_week_time());
            COMMAND.DO("send", user.id, {
                content: "你的妻子" + me.name + "送给你" + UTIL.to_c(count) + "朵玫瑰花。",
                attach: [
                    {
                        obj: "money/hua",
                        count: count
                    }
                ]
            });
        }
    }
}
}

