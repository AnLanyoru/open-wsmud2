import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "吴之荣";
    desc = "他原是归安县的知县，因贪赃枉法，百姓恨之切齿，终被告发革职。他长得尖嘴猴腮，一看就知不是好人 。";
    gender = 1;
    age = 44;
    per = 12;
    mp = 100;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 100],
            ["parry", 100],
            ["force", 100],
            ["unarmed", 100]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 15
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        }, {
            obj: ["sp/bj/wu"],
            odds: 1000
        });
    }

    on_die(killer) {
    killer.set_temp("fb/ao/wu", 1);
}
}
