import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "书房";
    desc = "这里是鳌拜书房，却没有一本书。各种古玩琳琅满目，商周青铜、汉瓦当、唐三彩，珍珠宝石，应有尽有，只要拥有一件，就够你吃一辈子了。北面墙上有一副<cmd cmd='look hua'> 画(hua) </cmd>。书桌上有一本<cmd cmd='look shu'> 书(shu) </cmd>。";
    exits = { "south": "bj/ao/houyuan" };
    door_dir = this.random(2);

    constructor() {
        super();
        this.set_item("hua", "画", "这张画很一般，足足有一扇门大，不知为什么挂在这儿。", [
            ["tleft", "向左推", open_door.bind(this,0)
            ], ["tright", "向右推", open_door.bind(this, 1)]
        ]);
        this.set_item("shu", "明史辑略", "这就是那本害得庄允城家破人亡的《明史辑略》。", [
            ["open", "打开", function (me) {
                if (this.door_dir == 1) {
                    me.notify("你打开《明史辑略》，发现扉页的右下角被鳌拜写了一个大大的杀字！");
                } else {
                    me.notify("你打开《明史辑略》，发现扉页的左下角被鳌拜写了一个大大的杀字！");
                }
      
            }]
        ]);
    }
}

function open_door(dir, me) {
    var fb = me.query_temp("fb/ao/tui");
    if (fb == 1) {
        return me.notify("门已经被你打开了，不要乱推，小心中暗器。");
    } else if (fb == 2) {
        return me.notify("画后面有暗器，还是不要乱推的好。");
    }
    if (this.door_dir !=dir) {
        me.from_attack(300, 100, "$N触动了机关！\n<red>突然，画后面飞出一支利箭向$N射去。</red>","<hir>$N一声惨嚎，被利箭射了个正着。</hir>","$N向旁边一跳，躲了过去。");

        me.set_temp("fb/ao/tui", 2);
    } else {
        me.send_room("$N将画卷往左移，只听轧轧几声，一扇暗门出现在$N眼前。");
        this.add_exit("north", "bj/ao/anshi");
        me.set_temp("fb/ao/tui", 1);
        me.add_fbscore(10);
    }
}
