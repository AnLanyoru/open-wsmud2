import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "内室";
    desc = "这里是一个空荡荡的房间，除了<cmd cmd='look floor'>地板(floor)</cmd>，什么也没有。";
    exits = { "east": "bj/tdh/hct" };

    constructor() {
        super();
        this.set_npc("bj/tdh/guan");
        this.set_item("floor", "地板", "你试著敲了敲地板，声响清脆，下面似乎是空心的。", [
            ["open", "移开", function (me) {
                me.from_attack(300, 100,
                    "$N掀开地板，只听“唰”的一声, 地道里突然白光一闪，一柄长剑倏的伸出，刺向你的小腹",
                    "<hir>$N匆忙间闪避不急，一声惨嚎，被长剑刺了个正着。</hir>",
                    "$N赶紧向旁边一跳，躲了过去。");
                me.send_room("一个道人从洞里探出头来，看了$N一眼，又伸手把地板关上了。");
            }]
        ]);
        this.add_action("knock", "敲地板", function (me) {
            if (this.query_exits("bj/tdh/andao1")) {
                return mo.notify("地板已经敲开了你还想干嘛？");
            }
            var npc = this.find_by_path("bj/tdh/guan");
            if (npc) {
                me.notify("关夫子对你喝到：你想干什么？");
                npc.do_kill(me);
                return;
            }
            me.send_room("$N在木板上咚地敲了一下。");
           var count= me.add_temp("fb/tdh/knock", 1, 1000);
           if (count == 3) {
               me.send_room("从地板里边伸出一双手把地板掀开了。");
               this.add_exit("down","bj/tdh/andao1");
           }
        });
    }
}
