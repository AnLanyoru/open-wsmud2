import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "liaoshang";
this.enter = function (me) {
    if (me.is_fighting()) return me.notify("战斗中疗伤，你找死吗？");
    if (me.hp >= me.max_hp) return me.notify("<hig>你目前气血充沛，没有受到任何伤害。</hig>");
    if (me.query_skill("force", 0) == 0) return me.notify("你还没学习任何内功心法，不会疗伤。");
    //if (me.mp < 1) return me.notify("你内力不够，无法治疗自身伤势。");
    // let pudu = me.query_prop('pudu');
    // if (pudu > 0 && !me.query_temp('pudu')) {
    //     let add = me.do_recover(me.max_hp * pudu / 100);
    //     me.notify("<hig>你的气血恢复了" + add + "点。</hig>");
    //     return me.set_temp('pudu', 1, 10000);
    // }
    me.notify("<hic>你坐下来运气用功，催动内力试图修复伤势。</hic>");
    me.send_message(me.name + "盘膝坐下，开始治疗伤势。");
    me.set_state({
        id: "liaoshang",
        cmd: "liaoshang",
        title: "疗伤",
        rate: 1,
        on_enter: do_dazuo,
        no_move: "疗伤时要专心，小心走火入魔。",
        desc: '[]',
        //"你只觉丹田处一股热流，慢慢涌向全身经脉。","你只觉你的内息游遍了你全身，身上的伤口渐渐愈合。"
        on_stop: function (me, isauto) {
            if (!isauto) {
                me.notify("<hiy>你停止疗伤，深深吸了口气，站了起来。</hiy>");
                me.send_message(me.name + "停止疗伤站了起来，脸色看起来好了很多。");
            }
        }
    });
    return true;
}
function do_dazuo(me) {
    var diff_hp = me.max_hp - me.hp;
    if (diff_hp > 0) {
        var v = me.query_skill(me.force_skill.id, 0) + me.con;

        v = v + (me.con * (me.query_prop("con") + v)
            * (me.query_skill("force", 0) / 1000 + 100));

        v = parseInt(v * (100 + me.query_prop("dazuo_per")) / 100);

        if (diff_hp < v) {
            v = parseInt(diff_hp);
            diff_hp = 0;
        }
        v = me.do_recover(v);
        me.notify("<hig>你的气血恢复了" + v + "点。</hig>");
    }
    if (diff_hp <= 0) {
        me.notify("<hiy>你疗伤完毕，深深吸了口气，脸色看起来好了很多。</hiy>");
        me.send_message(me.name + "疗伤完毕，脸色看起来好了很多。");
        return false;
    }
}
}
