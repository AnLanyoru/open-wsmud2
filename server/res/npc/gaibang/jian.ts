import { NPC } from "../../../core/char/npc.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends NPC {
    name = "简长老";
    desc = "简长老是丐邦的执法长老，代帮主执掌法刀以及青竹令等";
    title = "丐帮九袋长老";
    gender = 1;
    age = 50;
    per = 23;
    family = FAMILIES.GAIBANG;
    family_level = 3;
    max_mp = 310000;
    max_hp = 300000;
    prop = {
        gj: 5000,
        mz: 5000,
        ds: 5000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/mugun", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["club", 500],
            ["literate", 500],
            ["feiyanzoubi", 500],
            ["gaibangxinfa", 500],
            ["huntianqigong", 500, "force"],
            ["xiaoyaoyou", 500, "dodge"],
            ["jiaohuabangfa", 500, ["club","parry"]],
            ["taizuchangquan", 500, "unarmed"]);
    }

    on_master(me) {
    if (me.query_skill("gaibangxinfa", 0) < 100) return me.notify_fail("简长老说道：你的丐帮心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("jiaohuabangfa", 0) < 100) return me.notify_fail("简长老说道：你的叫花棒法掌握程度还不够，还需多加努力。");
    return true;
}
}

