import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "dazuo";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me) {
    if (me.is_fighting()) return me.notify("战斗中打坐，你找死吗？");
    if (me.state) return me.notify("你正在" + me.state.title + "，没有时间打坐。");
    if (me.query_skill("force", 0) == 0) return me.notify("你还没学习任何内功心法，不会打坐。");
    me.notify("<hir>你坐下来运气用功，一股<HIW>内息</HIW>开始在体内流动。</hir>");
    me.send_message(me.name + "盘膝坐下，开始修炼内力。");
    me.set_state({
        id: "dazuo",
        cmd: "dazuo",
        title: "打坐运功",
        rate: 2,
        on_enter: do_dazuo,
        no_move: "打坐时要专心，小心走火入魔。",
        desc: '[]',
        stime: Date.now(),
        //"你只觉丹田处一股热流，慢慢涌向全身经脉。","你只觉你的内息游遍了你全身，全身上下舒畅无比。","你感觉冥冥之中有股力量被引入体内，化为内力。"
        on_stop: function (me, isauto) {
            me.notify("<hiy>你运功完毕，深深吸了口气，站了起来。</hiy>");
            me.send_message(me.name + "运功完毕，站了起来。");
            if (isauto && me.query_setting('auto_work')) {
                return WORLD.check_user_next(me);
            }
        },
        on_check: on_check
    });
    return true;
}
}

function on_check(me) {
    let speed = count_speed(me);
    let str = ['<hic>你正在打坐运功，当你满内力时，每10秒增加', speed, "最大内力，预计"];

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
        let v = me.query_skill(me.force_skill.id, 0) + me.con;
        v = v + (me.con * (me.query_prop("con") + v));
        v = parseInt(v * (100 + me.query_prop("dazuo_per")) / 100);
        me.notify("<hig>你的内力恢复了" + v + "点。</hig>");
        me.add_mp(v);
    } else {
        if (max > me.max_mp) {
            let v = count_speed(me);
            me.notify("<hig>你的最大内力增加了" + v + "点。</hig>");
            me.max_mp += v;
            me.mp += v;
            me.recount();
            return me.notify_hp();
        }
        return me.notify_fail("<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>");

    }
}
function count_speed(me) {

    let exp = parseInt((me.query_skill("force") / 100 + me.query_prop("dazuo")
        + 1 + me.con / 10) * (100 + me.family.query_temp('dazuo_per', 0)
            + WORLD.DATA.query_temp("dazuo_per", 0) + me.query_prop("dazuo_per")) / 100);
    let prop = me.query_prop('shaolin');
    if (prop > 0) {
        let time = Math.floor((Date.now() - me.state.stime) / 60000);
        exp += Math.min(time, prop);
    }
    return exp;
}
