import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "流氓";
    desc = "流氓巷里的大流氓。";
    title = "";
    gender = 1;
    age = 18;
    per = 20;
    mp = 300;
    max_mp = 300;
    hp = 300;
    max_hp = 300;
    score = 10;

    constructor() {
        super();
        this.set_objects(
            ["eq/lv1/lm_cloth", 1, 1]
        );
        this.skill_map(
            ["unarmed", 50],
            ["dodge", 50],
            ["sword", 50],
            ["parry", 50]);
        this.set_drop({
            obj: "money/coin",
            min: 20,
            max: 240
        }, {
                obj: ["eq/lv0/cloth", "eq/lv0/jian", "eq/lv0/mugun"],
                odds: 3000
            });
    }

    on_kill(me) {
    me.each_item(item => {
        if (item != this && item.path == this.path) {
            this.send_room("$N喊道：兄弟们有人搞事，并肩子上！");
            item.do_kill(me);
        }
    }, me.environment);
}
}
