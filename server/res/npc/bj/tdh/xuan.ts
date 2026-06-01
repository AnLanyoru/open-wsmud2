import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "玄真道长";
    desc = "这位沉默寡言的道人，便是天地会青木堂护法。他是青木堂数一数二的好手，一柄长剑使得出神入化。";
    title = "天地会青木堂护法";
    gender = 1;
    age = 55;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 2000;
    max_hp = 2000;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["sword", 200],
            ["houquan", 200, "unarmed"],
            ["yunlongjian", 200, "sword"],
            ["yunlongshenfa", 200, "dodge"],
            ["yunlongxinfa", 200, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        },
            {
                obj: ["book/bc#yunlongjian"],
                odds: 1000
            });
    }

    on_enter(me) {
    me.notify("玄真道长对你喝到：你不是我天地会的人，来这里做什么？");
    this.do_kill(me);
}
}
