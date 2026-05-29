import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "张淡月";
    desc = "这是一个黑衣大汉,脸色大变,身子发颤,似乎恐惧已极";
    title = "神龙教黑龙使";
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
    }

    on_kill(me) {
    this.send_room("洪安通喝到：来我们神龙教撒野？给我上！");
    this.each_item(item => {
        if (!item.is_player && item.hp > 0 && !item.master) {
            item.do_kill(me);
        }
    }, this.environment);
}
}
