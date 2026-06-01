import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { NPC } from "../../../core/char/npc.js";

export default class extends COMMAND {
    command = "kill";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, argid) {
    if (me.state) {
        return me.notify("你现在正在" + me.state.title + ",没时间杀人。");
    }
    if (me.environment.no_fight) {
        return me.notify("这里不允许战斗。");
    }
    var target = me.find_obj(argid, me.environment);
    if (!target || !target.do_kill) {
        return me.notify("你要攻击谁？");
    }
    if (target === me) return me.notify("你要攻击谁？");
    if (target.is_player) {

        // me.add_temp('k_ss', 1, UTIL.diff_time());
        if (target.query_setting("ban_pk"))
            return me.notify(target.name + "正在开启PK保护，你不能击杀" + target.call3() + "。");
        if (me.query_setting("ban_pk"))
            return me.notify("你正在开启PK保护，无法主动PK玩家。");
        else {
            if (!me.query_temp("pk")) {
                me.notify("<hic>你主动击杀玩家，7天内不能开启PK保护。</hic>");
            }
            me.set_temp("pk", 1, 24 * 3600000 * 7);
        }
    } else if (target.family && target.on_master) {
        if (me.query_setting("ban_pk"))
            return me.notify("你正在开启PK保护，无法击杀拜师NPC。");
    }

    if (me.enemy && me.enemy[0] == target) {
        return me.notify("加油，加油！！");
    }
    if (me.fight_type == 1) return me.notify("你先比试完再说。");
    if (me.is_fighting()) {
        for (var i = 0; i < me.enemy.length; i++) {
            if (me.enemy[i] == target) {

                me.enemy.splice(i, 1);
                me.enemy.splice(0, 0, target);
                return me.send_room("$N扑向$n！", target);;
            }
        }
        if (target.on_kill && target.on_kill(me) == false) return;
        target.do_kill(me);
        target.begin_kill && target.begin_kill(me);
        return me.send_room("$N扑向$n！", target);
    }
    if (target.fight_type == 1) {
        // var eny = target.query_enemy();
        // if (eny) {
        //     eny.end_fight();
        // }
        // target.end_fight();
        // return me.notify('对方正在比试，你不能趁人之危。');
    }
    // me.send_room("$N对$n大喊一声：看招！\n", target);
    me.send_room("\n$N对著$n喝道：「"
        + target.call(me, true) + "！今日不是你死就是我活！」\n", target);
    //me.begin_attack(target, 2);

    if (target.on_kill && target.on_kill(me) == false) return;

    if (me.team) {
        for (var i = 0; i < me.team.length; i++) {
            var item = me.team[i];
            if (item.master == me.id && item.query_setting("auto_kill") == 2 && item.is_here(me)) {
                item.do_kill(target);
            }
        }
    }
    me.do_kill(target);
    target.begin_kill && target.begin_kill(me);
    if (me.team) {
        for (var i = 0; i < me.team.length; i++) {
            var item = me.team[i];
            if (item.master == me.id && item.query_setting("auto_kill") == 1 && item.is_here(me)) {
                item.do_kill(target);
            }
        }
    }

    WORLD.auto_pfm(me, target);

}
}

