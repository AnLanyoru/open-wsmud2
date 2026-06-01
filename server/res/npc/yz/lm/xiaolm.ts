import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "小流氓";
    desc = "他是流氓巷里的小流氓，整天无所事事，吊儿郎当";
    gender = 1;
    age = 18;
    per = 20;
    str = 30;
    con = 20;
    dex = 15;
    int = 15;
    mp = 100;
    max_mp = 100;
    hp = 200;
    max_hp = 200;
    score = 5;

    constructor() {
        super();
        this.set_objects(
            ["eq/lv0/cloth", 1, 1]
        );
        this.skill_map(
            ["unarmed", 30],
            ["sword", 30],
            ["dodge", 30],
            ["parry", 30]);
        this.set_drop({
            obj: "money/coin",
            min: 10,
            max: 20
        }, {
                obj: ["eq/lv0/cloth", "eq/lv0/shoes", "eq/lv0/jin"],
                odds: 8000
            },{
                obj: "sp/npc#liumang",
                odds: 40
            });
    }

    on_kill(me) {
    this.each_item(item=> {
        if (item!=this&& item.path == this.path) {
            this.send_room("$N喊道：兄弟们有人搞事，并肩子上！");
            item.do_kill(me);
        }
    }, this.environment);
}
}
