import { NPC } from "../../../core/char/npc.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends NPC {
    name = "宋远桥";
    desc = "他已年过六十，身材瘦长，满脸红光。恬淡冲和，沉默寡言。";
    title = "武当派第二代弟子 武当首侠";
    gender = 1;
    age = 45;
    per = 33;
    str = 25;
    con = 27;
    dex = 20;
    int = 25;
    family = FAMILIES.WUDANG;
    family_level = 2;
    level = 2;
    max_mp = 327400;
    max_hp = 391500;
    prop = {
        gj: 4000,
        mz: 4000,
        ds: 4000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv1/wd_cloth", 1, 1], ["eq/lv1/wd_jian", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["literate", 500],
            ["wudangchangquan", 500],
            ["wudangxinfa", 500],
            ["taijishengong", 500, "force"],
            ["tiyunzong", 500, "dodge"],
            ["wudangjianfa", 500, "sword"],
            ["taijiquan", 500, ["unarmed", "parry"]]);
    }

    on_master(me) {
    if (me.query_skill("wudangxinfa", 0) < 100) return me.notify_fail("宋远桥说道：你的武当心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("wudangjianfa", 0) < 100) return me.notify_fail("宋远桥说道：你的武当剑法掌握程度还不够，还需多加努力。");
    return true;
}
}

