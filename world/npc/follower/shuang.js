import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "双儿";
    desc = "她是一个十分清秀的少女,大约十四五岁年纪，一张雪白的脸庞,眉弯嘴小,笑靥如花,正笑嘻嘻地看着你。";
    title = "<hiw>天下无双</hiw>";
    gender = 2;
    age = 20;
    per = 42;
    str = 30;
    con = 15;
    dex = 40;
    int = 15;
    mp = 100;
    exp = 5000000;
    pot = 5000000;
    max_mp = 100;
    hp = 100;
    max_hp = 100;
    level = 3;
    max_item_count = 20;

    constructor() {
        super();
        this.skill_map(
            ["dodge", 150],
            ["parry", 150],
            ["force", 150],
            ["unarmed", 150],
            ["sword", 150],
            ["huashanjianfa", 150, "sword"],
            ["shenxingbaibian", 150, "dodge"]);
    }

    on_master_enter(me) {
    if (this.random(3) == 1) {
        if (me.gender == 1)
            me.notify("双儿笑嘻嘻地看着你，脆声道：相公，你回来啦。");
        else
            me.notify("双儿笑嘻嘻地看着你。");
    }
}
}
