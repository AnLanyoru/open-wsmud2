import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "章老三";
    desc = "这是一个神龙教弟子，一袭黑衣,混身透着一股邪气。";
    title = "神龙教小头目";
    gender = 1;
    age = 44;
    per = 26;
    mp = 400;
    max_mp = 1400;
    hp = 2500;
    max_hp = 2500;
    score = 70;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/jian", 1, 1
        ]);
        this.skill_map(
            ["dodge", 250],
            ["force", 250],
            ["unarmed", 250],
            ["sword", 250],
            ["staff", 200],
            ["shenlongjian", 250, "sword"],
            ["yixingbufa", 150, "dodge"],
            ["shenlongxinfa", 150, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 1,
            max: 10
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shenlongjian"],
            odds: 3000
        });
    }
}
