import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "许雪亭";
    desc = "这是个五十来岁的高瘦汉子，着一袭青衣，昂然挺立。";
    title = "神龙教青龙使";
    gender = 1;
    age = 55;
    per = 26;
    mp = 1400;
    max_mp = 4400;
    hp = 8500;
    max_hp = 8500;
    score = 10;
    prop = {
        zj: 100,
        gj: 300
    };

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/jian", 1, 1
        ]);
        this.skill_map(
            ["dodge", 250],
            ["parry", 250],
            ["force", 250],
            ["unarmed", 250],
            ["sword", 250],
            ["staff", 250],
            ["huagumianzhang", 250, "unarmed"],
            ["shenlongjian", 250, "sword"],
            ["yixingbufa", 250, "dodge"],
            ["shenlongxinfa", 250, "force"],
            ["shedaoqigong", 250, "parry"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["eq/lv2/sl_cloth", "eq/lv2/sl_tou", "eq/lv2/sl_shoes", "eq/lv2/sl_shou", "eq/lv2/sl_yao"],
            odds: 2000
        }, {
            obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shedaoqigong", "book/bc#shenlongjian"],
            odds: 5000
        });
        this.set_chat_msg([
            "许雪亭忽然一怕脑袋，说：对了，可以用百花腹蛇膏！",
            "许雪亭怒道：唉，偌大一个神龙教，都毁在一个娘么手里了！",
            "许雪亭叹口气，说道：唉，不杀了洪安通，谁也活不了。"
        ]);
    }
}
