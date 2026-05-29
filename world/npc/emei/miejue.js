import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "灭绝";
    desc = "她是一位白发苍苍的老尼，是峨眉派第三代掌门，她脸上冷冰冰，毫无表情。";
    title = "峨眉派掌门";
    gender = 2;
    age = 60;
    per = 31;
    dex = 30;
    str = 30;
    max_mp = 827400;
    max_hp = 891500;
    family = FAMILIES.EMEI;
    family_level = 3;
    level = 3;
    prop = {
        gj: 8000,
        mz: 8000,
        ds: 8000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["sword", 800],
            ["literate", 800],
            ["emeixinfa", 800],
            ["linjizhuang", 800, "force"],
            ["zhutianbu", 800, "dodge"],
            ["huifengjian", 800],
            ["yitianjianfa", 800, "sword"],
            ["jindingzhang", 800, "unarmed"]);
    }

    on_master(me) {
    if (me.gender != 2) return me.notify_fail("灭绝对你哼了道：再不走小心杀了你！");
    if (me.query_skill("linjizhuang", 0) < 500 && me.query_skill("linjizhuang2", 0) < 500) return me.notify_fail("灭绝说道：你的临济十二庄掌握程度还不够，需要多加练习。");
    if (me.query_skill("huifengjian", 0) < 300) return me.notify_fail("灭绝说道：你的回风拂柳剑掌握程度还不够，需要多加练习。");
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
