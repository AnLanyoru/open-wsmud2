import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "神龙教女弟子";
    desc = "这是一个神龙教女弟子，一袭红衣,长得颇为可爱。";
    gender = 2;
    age = 25;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 1;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/jian", 1, 1
        ]);
        this.skill_map(
            ["dodge", 150],
            ["parry", 150],
            ["force", 150],
            ["unarmed", 150],
            ["sword", 150],
            ["staff", 150],
            ["shenlongjian", 150, "sword"],
            ["yixingbufa", 150, "dodge"],
            ["shenlongxinfa", 150, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 1,
            max: 5
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shenlongjian"],
            odds: 3000
        });
        this.set_chat_msg([
            "年轻弟子忽然高声叫道:教主宝训,时刻在心,建功克敌,无事不成!",
            "年轻弟子忽然齐声叫道:众志齐心可成城,威震天下无比伦!",
            "年轻弟子忽然齐声叫道:神龙飞天齐仰望,教主声威盖八方!",
            "年轻弟子忽然齐声叫道:乘风破浪逞英豪,教主如同日月光!",
            "年轻弟子齐声叫道:教主永享仙福,寿与天齐!"
        ]);
    }
}
