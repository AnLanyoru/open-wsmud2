import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "陈近南";
    desc = "这是一个文士打扮的中年书生，神色和蔼。他就是天下闻名的天地会总舵主陈近南，据说十八般武艺，样样精通。偶尔向这边看过来，顿觉他目光如电，英气逼人。";
    title = "<hiw>天地会总舵主</hiw>";
    gender = 1;
    age = 45;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 5000;
    max_hp = 5000;
    score = 55;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 300],
            ["parry", 300],
            ["force", 300],
            ["unarmed", 300],
            ["sword", 300],
            ["yunlongjian", 300, "sword"],
            ["yunlongshenfa", 300, "dodge"],
            ["yunlongxinfa", 300, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        },
            {
                obj: ["book/bc#yunlongjian", "book/bc#yunlongshenfa", "book/bc#yunlongxinfa"],
                odds: 8000
            }, {
            obj: ["eq/lv2/yunlongjian"],
            odds: 1000
        });
    }
}
