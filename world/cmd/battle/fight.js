import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "fight";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, argid) {
    if (argid == "none") {
        var items = me.environment.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].is_player && items[i].query_temp("fight") == me.id) {
                me.send_room("看起来$N并不想跟$n较量。", items[i], true);
                return me.notify("你拒绝了" + items[i].name + "的比试请求。");
            }
        }
        return me.notify("这里没有人想要和你比试。");
    }
    if (me.environment.no_fight) return me.notify("这里不允许战斗。");
    var target = me.find_obj(argid, me.environment);
    if (!target) {
        return me.notify("你要攻击谁？");
    }
    if (target.can_speek == false) return me.notify("看起来它并不想跟你较量。");
    if (target == me) return me.notify("你不能和自己比试。");
    if (target.hp < target.max_hp * 0.95) {
        return me.notify(target.name + "的状态不是很好，你想趁人之危吗？");
    }
    if (me.hp < me.max_hp) {
        return me.notify("你先调整好自己的状态再来找别人比试吧。");
    }
    if (me.is_fighting(target)) {
        return me.notify("加油，加油！！");
    }
    if (me.is_fighting()) {
        return me.notify("等你打完再和别人比试吧！");
    }
    if (target.is_fighting()) {
        return me.notify("对方正在切搓，等对方打完再来吧");
    }
    me.send_room("\n$N对著$n说道："
        + me.callme()
        + me.name + "，领教"
        + target.call() + "的高招！\n", target);

    if (target.no_fight || target.query_setting("off_fight")) {
        return me.send_room("看起来$n并不想跟$N较量。", target);
    } else {
        var ol_fight = me.query_temp("fight");
        if (ol_fight) {
            if (ol_fight != target.id) {
                var ol_target = me.find_obj(ol_fight, me.environment);
                if (ol_target) {
                    ol_target.notify("<yel>" + me.name + "取消了和你比试的念头。\n</yel>");
                }
                me.remove_temp("fight");
            }
        }
        if (target.is_player) {
            if (target.query_temp("fight") != me.id) {
                me.set_temp("fight", target.id, 10000);
                target.notify("<hiy>" + me.name + "想和你比试，你是否同意：</hiy>");
                target.send_commands("fight " + me.id, "和" + me.name + "比试", "fight none", "不同意");
                return me.notify("<hiy>已发送比试请求，正在等待对方同意。</hiy>");
            } else {
                target.remove_temp("fight");
            }

        } else {

            if (target.on_before_fight && target.on_before_fight(me) === false)
                return;

        }
        me.send_room("$n说道：既然" + me.call() + "赐教，" + target.callme() + "只好奉陪。\n", target);
        me.begin_attack(target, 1);
        target.begin_attack(me, 1);

    }
}
}
