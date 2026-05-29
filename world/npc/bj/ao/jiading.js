import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "家将";
    desc = "鳌拜府上的家将，看上去有两下子";
    gender = 1;
    age = 25;
    per = 15;
    mp = 100;
    max_mp = 500;
    hp = 500;
    max_hp = 500;
    score = 10;

    constructor() {
        super();
        this.skill_map(
            ["club", 150],
            ["dodge", 150],
            ["sword", 150],
            ["parry", 150],
            ["juemengun", 150,["club","dodge"]]);
        this.set_objects(
            ["eq/lv1/guanfu", 1, 1],
            ["eq/lv0/tiegun", 1, 1]
        );
        this.set_drop({
            obj: "money/coin",
            min: 10,
            max: 30
        }, {
                obj: ["eq/lv0/cloth", "eq/lv0/tiegun", "eq/lv0/shoes"],
                odds: 3000
            }, {
                obj: ["eq/lv0/jd_cloth", "eq/lv0/jd_shoes", "eq/lv1/guanfu"],
                odds: 3000
        }, {
            obj: ["book/bc#juemengun"],
            odds: 3000
        });
    }
}
