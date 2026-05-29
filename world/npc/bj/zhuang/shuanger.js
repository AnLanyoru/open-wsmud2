import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "双儿";
    desc = "她是一个十分清秀的少女,大约十四五岁年纪，一张雪白的脸庞,眉弯嘴小,笑靥如花,正笑嘻嘻地看着你。";
    title = "<hiw>天下无双</hiw>";
    gender = 2;
    age = 14;
    per = 39;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;

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
            ["sword", 150],
            ["huashanjianfa", 150, "sword"],
            ["shenxingbaibian", 150, "dodge"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenxingbaibian", "book/bc#huashanjianfa", "book/bc#shenlongjian"],
            odds: 3000
        });
        this.set_ask("跟我走吧", function (me) {
            if (me.query_temp("fb/zhuang/shuang")) {
                me.notify("<hiy>双儿道:夫人待我恩重如山,主人对我庄家又有大恩。夫人要我服侍主人,我一定尽心。</hiy>");
                var obj = me.add_obj("sp/npc#shuang");
                if (obj) {
                    me.notify("你获得了" + obj.unit_name(1) + "。");

                }
                me.remove_temp("fb/zhuang/shuang");
                this.destroy();
            } else {
                me.notify("双儿睁大眼睛看着你说道：不行的,夫人没有同意。");
            }
        });
    }
}
