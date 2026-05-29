import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "土匪";
    desc = "这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。";
    gender = 1;
    age = 25;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 30;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 150],
            ["parry", 150],
            ["force", 150],
            ["unarmed", 150],
            ["blade", 150],
            ["wuhuduanmendao", 250, "blade"]);
        this.set_drop({
            obj: "money/silver",
            min: 1,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shenlongjian"],
            odds: 3000
        });
    }

    on_enter(me) {
    me.notify("土匪一声大喊: 此山是我开，此树是我栽，若要从此过，留下买路财 !");
    this.do_kill(me);
}
}
