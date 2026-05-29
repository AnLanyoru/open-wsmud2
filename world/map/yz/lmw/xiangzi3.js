import { ROOM } from "../../../../os/room/room.js";

export default function() {
    const SKILL = globalThis.SKILL;
this.inherits(ROOM);
this.name = "巷子深处"
this.desc = "这里是流氓巷的最里面，这里的小流氓反而变少了，四周看上去也有些整洁，有块空地上放着一个<cmd cmd='look shinian'>石撵</cmd>，四周地面磨得的光亮，看上去像是经常被拖动的样子。北面好像有个仓库，有个大铁门锁着。";
this.exits = { "west": "yz/lmw/xiangzi2",  "east": "yz/lmw/fang", };
this.set_npc(["yz/lm/liumang", 2]);
this.on_leave = function (me,dir) {
    if (dir == "east") {
        var obj = this.find_obj_bypath("yz/lm/liumang");
        if (obj) {
            if (me.gender == 1) {
                me.notify("流氓吊儿郎当的拦住你。");
            } else {
                me.notify("流氓轻佻的朝你吹了个口哨，嬉皮笑脸的说道：妹妹要到哪里去？");
            }

            return false;
        }
    }
}
this.set_item("men", "大铁门", "这扇大门紧闭，背后不知道藏了什么东西。", [[
    "tui", "推", function (me) {
        me.notify("你推了下大铁门，感觉自己推不开。");
    }
]]);
this.set_item("shinian", "石撵", "这是一个很重的石撵，把手摸得铮亮。", [[
    "tui", "推", function (me) {
        if (me.mp < 10) {
            return me.notify_fail("你使足全力推了推石撵，可是内力耗尽使不上多少劲。");
        }
        me.notify("你使足全力推了推石撵，石撵缓慢的动了起来。");
        me.set_state({
            id: "tuishi",
            title: "推石撵",
            player: me,
            rate: 2,
            skill_base: SKILL.get("unarmed"),
            on_enter: do_work,
            desc: '["你脸憋的通红，卯足了劲推着石撵转动。","你大喝一声，猛的发力，石撵呼的一下转了个圈。"]',
        });
    }
]]);
function do_work(me) {
    if (me.mp < 10) {
        return me.notify_fail("你感觉自己的力气耗光了，再也推不动了。");
    }
    if (me.query_skill("unarmed", 0) > 100) return me.notify_fail("你感觉推这个东西跟玩似的，已经对你没有任何好处了。");
    me.add_mp(-10);
    this.skill_base.add_exp(me, 30);
    me.notify_fail("<hic>你推了一圈，感觉自己对拳脚方面功夫多了些理解。</hic>");
}
}
