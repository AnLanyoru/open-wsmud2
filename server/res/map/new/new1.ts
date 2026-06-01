import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "训练室";
    desc = "这是一间空荡荡的训练室，所有要去闯荡江湖的人们都需要在这里学习一些基本知识， 就算你是MUD老鸟，你也需要了解下在没有命令可以输入的情况下如何挖泥。房子中间有个桌子，几张<cmd cmd='look yizi'><hig>椅子</hig></cmd>。";
    exits = { "east": "new/new2" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("new/daoshi");
        this.add_action("guid_start", null, function (me) {
            var lv = me.query_temp("new");
            if (lv != 1) return;
            me.set_temp("new", 2);
            me.notify("指引者愉快的笑了。\n指引者对你说道：点击房间里人物或物品名称，会显示他们的简介和可用指令，你可以选择你想要要的操作。");


            on_guide(me);


        });
        this.add_action("guide_over", null, function (me) {
            var lv = me.query_temp("new");
            if (lv != 1) return;
            me.notify("指引者对你说：好吧，祝你游戏愉快！");
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
        });
        this.set_item("yizi", "椅子", "这是一张椅子，可以坐。", [[
            "zuo2", "坐下去", function (me) {
                me.notify("你拉开一张椅子坐了上去。");
                if (me.query_temp('new', 0) === 3) {
                    me.set_temp("new", 4);
                    this.call_out(next_guide4, 1000, me);
                }
            }
        ]]);
        this.add_action("zuo", "坐下来", function (me) {
            var lv = me.query_temp("new");
            if (lv == 2) {
                me.notify("你一屁股坐在地上。");
                this.call_out(next_guide, 1000, me);
            } else {
                me.notify("好好听课，别乱坐。");
            }
        });
    }

    on_enter(me) {

    // this.items[0].add_action("guid_over", "直接闯荡江湖", on_guide_over);
    // 
    var lv = me.query_temp("new");
    if (lv == 1) {

        me.notify("指引者双手抱拳，对你作了个揖道：这位" + me.call()
            + "请了，接下来我来告诉你一些这个世界的基本知识。");
        me.send_commands('guide_over', '<blk>直接闯荡江湖</blk>', 'guid_start', '<hig>我需要指引</hig>');

        // me.call_out(function () {
        //     me.notify("<hig>指引者对你说道：首先你要学会如何和别人互动。点击我的名字，你将会看到一些操作，然后选择【我需要指引】。</hig>");
        // }, 1000);

        this.items[0].add_action("guid", "我需要指引", on_guide);
    }
}
    on_leave(me, dir) {
    if (!me.is_player) return true;
    var lv = me.query_temp("new");
    if (!lv) return true;
    if (lv < 4) return me.notify_fail("你先听完课再乱跑。");
    if (dir != "east") return me.notify_fail("你要去东面的训练室找指引者。");
}
}

function on_guide(me) {
    var lv = me.query_temp("new");
    if (lv === 1) {
        me.notify("指引者双手抱拳，对你作了个揖道：这位" + me.call()
            + "请了，接下来我来告诉你一些这个世界的基本知识。");
        me.send_commands('guide_over', '<blk>直接闯荡江湖</blk>', 'guid_start', '<hig>我需要指引</hig>');

    }
    else if (lv == 2) {
        me.notify("<hig>指引者对你说道：打开底部动作按钮，然后点击坐下来。</hig>");
    } else if (lv == 3) {
        me.notify("<hig>指引者说到：在房间描述里点击【椅子】，然后坐下去");
    } else if (lv == 4) {
        me.notify("<hig>指引者对你说道：你打开背包，点击拳脚功夫入门，然后点击学习。</hig>");
    } else if (lv == 5) {
        me.notify("<hig>指引者对你说道：去南面的训练室杀掉一个木头人，带点战利品回来。</hig>");
    } else if (lv == 6) {
        me.notify("<hig>指引者对你说道：学会基本内功，然后打开动作栏点击疗伤。</hig>");
    }
}
function next_guide3(me) {
    me.notify("<hig>指引者对你说道：接下来，点击动作按钮，你将会看到一些操作，那是你所在房间或自己的可用命令。嗯，站着听课也累了，坐下来试试。</hig>");

}
function next_guide(me) {
    me.set_temp("new", 3);
    me.notify("指引者说道：如果你对当前的显示效果不满意可以通过设置更改效果。");
    me.send_commands("_setting combat_size 1.5rem",
        "放大底部操作栏", "_setting fontsize 1rem", "放大文字");
    this.call_out(function () {
        me.notify("指引者微笑着说：有时候房间里有些隐藏物品可以操作，比如这里有个椅子，你可以坐在椅子上面。<hig>（在房间描述里点击【椅子】如果物品可用会显示描述及可用操作）</hig>");

    }, 1000);

}
function next_guide4(me) {
    me.notify("指引者点了点头：不错，学的挺快。想要获得高级道具和技能，观察和利用周围环境是必不可少的。");
    me.notify("<hig>指引者说道：接下来教你怎么移动到别的房间：点击房间的出口方向就可以走出这个房间，来东面的训练室找我。</hig>");
    var npc = this.find_obj_bypath("new/daoshi");

    if (npc) {
        npc.do_command("go", "east");
    }
}
