import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "官兵";
    desc = "虽然官兵的武艺不能和武林人士相比，可是他们讲究的是人多力量大。";
    gender = 1;
    age = 35;
    per = this.random(20) + 10;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv1/junfu", 1, 1
        ], [
            "eq/lv0/dao", 1, 1
        ]);
        this.set_drop({
            obj: "money/silver",
            min: 2,
            max: 5
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/jian", "eq/lv0/dao"],
            odds: 6000
        }, {
            obj: ["eq/lv1/guanfu", "eq/lv1/junfu", "book/book#sword", "book/book#blade"],
            odds: 2000
        });
        this.skill_map(
            ["unarmed", 150],
            ["dodge", 150],
            ["parry", 150],
            ["blade", 150]);
    }

    on_kill(me) {
    this.each_item(item => {
        if (item != this && item.path == this.path) {
            this.send_room("$N喊道：兄弟们并肩子上！");
            item.do_kill(me);
        }
    }, this.environment);
}
}
