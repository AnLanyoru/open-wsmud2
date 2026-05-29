import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "李力世";
    desc = "这是一个身材矮小，满连胡须的中年人，身上的衣服又脏又破，脸上满是皱纹，看上去饱经风霜。";
    gender = 1;
    age = 55;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1,
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["blade", 200],
            ["houquan", 200, "unarmed"],
            ["yunlongshenfa", 200, "dodge"],
            ["yunlongxinfa", 200, "force"],
            ["wuhuduanmendao", 200, "blade"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 14
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        },
            {
                obj: ["book/bc#wuhuduanmendao"],
                odds: 5000
            });
    }
}
