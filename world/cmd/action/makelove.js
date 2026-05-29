import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "makelove";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, oid) {

    if (me.environment.parent.id != 'home') return me.notify("这里双修可不太好，找个安全点的地方吧！");

    let target = me.find_obj(oid, me.environment);

    if (!target) return me.notify("你要和谁双修？");
    if (target == me) return me.notify("你要和自己双修？");
    //if (me.gender == 1 && target.gender == me.gender) return me.notify("没有这个功能。");
    //  if (hasother && me.is_player) return me.notify("这儿还有别人呢，你好意思双修呀！");
    //  if (me.is_player && target.is_player) return me.notify("你不能和玩家控制的人物双修。");
    if (!target.is_player && target.master != me.id) return me.notify(target.name + "不愿意和你双修。");
    //if (target.on_makelove && target.on_makelove(me) === false) return;
    if (me.query_temp("mk_request")) {
        this.accept(me, target);
        this.accept(target, me);
    } else {
        if (target.query_temp("mk_request")) return;

        if (target.is_player) {
            target.notify("<yel>看样子" + me.call3() + "想和你双修...</yel>");
            target.send_commands("makelove " + me.id, "接受");
            target.set_temp("mk_request", 1, 10000);
        } else {

            this.accept(me, target);

            this.accept(target, me);
        }

    }


}
    accept(me, target) {

    let name = target.name;
    me.send("<yel>你和" + name + "面对面盘膝坐下，掌心相对，双掌相抵。</yel>");
    let str = '["自' + name + '掌心涌来一股热流，慢慢涌向你全身经脉。","内力游遍任督二脉，你只觉全身舒畅无比。", "你将内力引入丹田，化为一股热流涌入' + name + '掌心。"]';

    me.set_state({
        id: "sx",
        title: "双修中",
        rate: 2,
        on_enter: do_dazuo,
        no_move: "双修时要专心，小心走火入魔。",
        desc: str,
        stime: Date.now(),
        on_check: on_check,
        on_stop: function (p, isauto) {
            p.notify("<hiy>你双修完毕，深深吸了口气，站了起来。</hiy>");
            if (p.is_player && !target.is_player)
                target.set_state(null);
            if (isauto && p.query_setting('auto_work')) {
                return WORLD.check_user_next(p);
            }

        }
    });
}
}

const WORLD = globalThis.WORLD;
function on_check(me) {
    let speed = parseInt((me.query_skill("force") / 100
        + me.query_prop("shuangxiu")
        + 1 + me.con / 10) * (100 + me.query_prop("dazuo_per")
            + me.family.query_temp('dazuo_per', 0)
            + WORLD.DATA.query_temp("dazuo_per", 0) + 50) / 100);
    let str = ['<hic>你正在双修中，每10秒增加', speed, "最大内力，预计"];

    var max = me.limit_mp + me.query_prop("limit_mp");
    let time = Math.floor((max - me.max_mp) / speed) * 10;

    if (time < 60) str.push('不到1分钟');
    else {
        if (time > 86400) {
            str.push(Math.floor(time / 86400), '天');
            time = time % 86400;
        }
        if (time > 3600) {
            str.push(Math.floor(time / 3600), '小时');
            time = time % 3600;
        }
        str.push(Math.floor(time / 60), '分钟');
    }
    str.push('达到内力上限', max, '</hic>。');
    me.send(str.join(""));
}
function do_dazuo(me) {
    var max = me.limit_mp + me.query_prop("limit_mp");

    var force_skill = me.force_skill;
    if (!force_skill) return me.notify_fail("<hir>你突然忘了怎么打坐。</hir>");
    if (me.mp < me.max_mp) {
        if (me.mp >= me.max_mp) {
            return me.notify_fail("<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>");
        }
        let v = parseInt(me.max_mp / 3);
        me.notify("<hig>你的内力恢复了" + v + "点。</hig>");
        me.add_mp(v);
    } else {
        if (max > me.max_mp) {
            let v = parseInt((me.query_skill("force") / 100
                + me.query_prop("shuangxiu")
                + 1 + me.con / 10) * (100 + me.query_prop("dazuo_per")
                    + me.family.query_temp('dazuo_per', 0)
                    + WORLD.DATA.query_temp("dazuo_per", 0) + 50) / 100);
            me.notify("<hig>你的最大内力增加了" + v + "点。</hig>");
            me.max_mp += v;
            me.mp += v;
            me.recount();
            return me.notify_hp();
        }
        if (me.is_player)
            return me.notify_fail("<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>");

    }
}
