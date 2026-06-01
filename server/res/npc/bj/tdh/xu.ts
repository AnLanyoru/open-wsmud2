import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "徐天川";
    desc = "他是青木堂数一数二的好手，手上功夫十分了得，尤其擅使一套猴拳。";
    title = "天地会青木堂护法";
    gender = 1;
    age = 55;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 1000;
    max_hp = 1000;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["houquan", 200, "unarmed"],
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
                obj: ["book/bc#houquan"],
                odds: 5000
            });
    }
}
