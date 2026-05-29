import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "训练室";
    desc = "这是一间空荡荡的训练室，所有要去闯荡江湖的人们都需要在这里学习一些基本知识，就算你是MUD老鸟，你也需要了解下在没有命令可以输入的情况下如何挖泥。";
    exits = { "west": "new/new1", "south": "new/new3" };
    no_fight = true;

    on_enter(me) {
    if (me.is_player) {
        var lv = me.query_temp("new");
        if (lv == 4) {
            me.notify("指引者对你说道：如果你不喜欢这种方式，可以在设置里面改为方向描述的方式，点击房间名称就可移动到相应房间。");
            me.send_commands("_setting exits_dir 0", "设置出口显示为小地图", "_setting exits_dir 1", "设置出口显示为方向");
            this.call_out(next_guide, 1000, me);
        } else if (lv == 5) {
            me.notify("指引者对你说道：怎么样，找到木头人了吗?");
        } else if (lv == 6) {
            me.notify("指引者对你说道：学会内功心法，治好伤势就来找我。");
        }

    } else {
        me.add_action("next", "我学完了", function (me) {
            var lv = me.query_temp("new");
            if (lv != 4) return me.notify_fail("好好听课不要乱点。");
            if (!me.query_skill("unarmed", 0)) {
                return me.notify("指引者看了你一眼，说道：学会一些基本拳脚再来找我。");
            }
            me.notify("指引者说道：当你学会技能后，动作栏下面将会显示你所有的可用绝招，当然只会显示已经装备的技能的绝招（基本技能除外）。\n");
            next_guide2(me, this);
        });
    }
}
    on_leave(me, dir) {

    var lv = me.query_temp("new", 0);
    if (!lv) return true;
    if (lv < 5) return me.notify_fail("你先听完课再乱跑。");
    if (lv == 5) {
        if (dir != "south") {
            return me.notify_fail("木头人在南面的训练室。");
        } else {
            return true;
        }
    }
    return me.notify_fail("你先听完课再乱跑。");

}
}

const UTIL = globalThis.UTIL;
function next_guide(me) {
    var obj = me.add_obj("sp/new/ksunarmed", 1);
    if (obj) {
        me.add_exp(1000, 1000);
        me.notify("指引者给了你一本" + obj.color_name + "。");
        me.notify("<hig>指引者对你说道：打开背包，点击拳脚快速入门，下面会显示物品可用操作，然后点击学习，等你学练会了这个技能再来找我。</hig>");
    }
}
function next_guide2(me, npc) {
    me.set_temp("new", 5);
    me.notify("<hig>指引者对你说道：接下来你用刚学会的技能去南面的训练室杀掉一个木头人，带点战利品回来。</hig>");
    npc.add_action("next", "交战利品", next_guide3);
}
function next_guide3(me, npc) {

    if (me.query_temp("new") != 5) return false;
    var obj = me.find_obj_bypath("sp/new/mutou");
    if (!obj) return me.notify("你身上没有木头，没法交给指引者。");

    if (me.remove_obj(obj, obj.count)) {
        me.send_room("$N给了$n" + UTIL.to_c(obj.count) + obj.unit + obj.name + "。", this);
    }
    me.set_temp("new", 6);
    me.notify("<hig>指引者对你说：刚才的战斗应该受了点伤吧，想要治疗自己的伤势，你需要学会内功心法，这里有一本最基本的内功心法，你学会后把伤势治疗好再告诉我。</hig>");

    var obj = me.add_obj("sp/new/ksforce", 1);
    if (obj) {
        me.notify("指引者给了你一本" + obj.color_name + "。");
    }
    this.add_action("next", "疗伤完毕", guide_over);
}
function guide_over(me) {

    var lv = me.query_temp("new");
    if (lv != 6) return me.notify_fail("好好听课不要乱点。");
    if (!me.query_skill("force", 0)) {
        return me.notify("指引者看了你一眼，说道：学会内功心法再来找我。");
    }
    if (me.hp < me.max_hp) {
        return me.notify("指引者看了你一眼，说道：你身上的伤还没好呢。");
    }

    me.notify("指引者点了点头。\n指引者对你说道：很好，这些基本的操作你都了解了，接下来你就可以去闯荡江湖了，如果你还有什么想了解的，可以来问我。");
    me.send_commands("ask1 " + this.id, "如何开始", "ask6 " + this.id, "<hig>开始闯荡江湖</hig>");
    this.remove_action("guid");

    this.remove_action("next");
    this.add_action("ask1", "如何开始", ask1);
    this.add_action("ask6", "<hig>开始闯荡江湖</hig>", ask6);
}
function ask1(me) {
    me.notify("指引者对你说：踏入江湖后最好是先拜入一个门派学习武功，提升你的实力，再通过挑战副本进一步提升自己。");
}
function ask6(me) {
    if (!me.query_temp("new")) return;
    me.notify("指引者对你说：祝你游戏愉快，这是你完成新手训练的奖励。");
    me.items.length = 0;
    me.do_command("pack");
    me.remove_temp("new");
    me.notify("指引者对你挥了挥手。");
    var fb = me.environment;

    me.call_out(function () {
        if (this.moveto("yz/kedian", null, me.name + "风尘仆仆的走了进来。") != false) {

            fb.clear_copy(me);
            var obj = me.add_obj("cash/new_box")
            if (obj) {
                me.notify("指引者给你一个" + obj.color_name + "。");
            }
            me.add_exp(10000, 10000, 10000);
        }
    }, 1000);
}
