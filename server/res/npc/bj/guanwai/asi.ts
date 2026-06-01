import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "平四";
    desc = "他是胡家忠心耿耿的仆役。";
    title = "胡家仆佣";
    gender = 1;
    age = 45;
    per = 26;
    mp = 1400;
    max_mp = 4400;
    hp = 5500;
    max_hp = 5500;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 300],
            ["parry", 300],
            ["force", 300],
            ["unarmed", 300],
            ["blade", 300],
            ["sixiangbu", 300, "dodge"],
            ["hujiadaofa", 300, "blade"],
            ["lengyueshengong", 300, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        }, {
            obj: ["book/bc#hujiadaofa", "book/bc#sixiangbu", "book/bc#lengyueshengong"],
            odds: 3000
        });
    }

    on_leave(me, dir) {
    if (dir == "north") {
        me.notify("平四拦住你恭敬的说道：" + me.call() + "，有什么事情吗？");
        return false;
    }
}
}
