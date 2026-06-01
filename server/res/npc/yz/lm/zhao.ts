import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "赵三拳";
    desc = "流氓巷里的流氓头领，神神秘秘的整天在巷子最里面不知道在干嘛";
    title = "流氓头领";
    gender = 1;
    age = 32;
    per = 22;
    mp = 1200;
    max_mp = 1200;
    hp = 1200;
    max_hp = 1200;
    score = 20;

    constructor() {
        super();
        this.set_chat_msg([
            "赵三拳嘀嘀咕咕的说道：不对啊，我照这本书练，怎么没什么长进。",
            "赵三拳呸了一声：崔员外那厮，孝敬的都是些什么破烂玩意。。",
            "赵三拳嘿嘿笑道：好久没去找小红了，等学会这个武功就去丽春院逛逛。"
        ]);
        this.set_objects(
            ["eq/lv1/xk_cloth", 1, 1]
        );
        this.skill_map(
            ["unarmed", 100],
            ["dodge", 100],
            ["parry", 100],
            ["blade", 100], ["taizuchangquan", 100, "unarmed"]);
        this.set_drop({
            obj: "money/silver",
            min: 5,
            max: 10
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/mugun", "eq/lv0/jian", "sp/yz/qiantiao"],
            odds: 8000
        },
            {
                obj: ["book/book#unarmed", "book/book#parry", "book/book#dodge", "book/book#force"],
                odds: 8000
            }, {
            obj: ["eq/lv1/lm_head", "eq/lv1/lm_cloth", "eq/lv1/lm_shoes", "eq/lv1/lm_shou", "eq/lv1/lm_jian", "book/bc#taizuchangquan"],
            odds: 9000
        });
    }
}
