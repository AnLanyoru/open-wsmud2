import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "鲁有脚";
    desc = "丐帮长老，在丐帮中有仁有义，行事光明磊落，深得洪七公的器重。";
    title = "掌棒龙头";
    gender = 1;
    age = 65;
    per = 33;
    pfm_rate = 1;
    family = FAMILIES.GAIBANG;
    family_level = 2;
    level = 3;
    max_mp = 310000;
    max_hp = 300000;
    prop = {
        gj: 5000,
        mz: 5000,
        ds: 5000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiegun", 1, 1]);
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
            ["jiaohuabangfa", 500],
            ["dagoubang", 500, "club"],
            ["taizuchangquan", 500, "unarmed"]);
    }

    on_master(me) {
    if (me.query_skill("huntianqigong", 0) < 300 && me.query_skill("huntianqigong2", 0) < 300) return me.notify_fail("鲁有脚说道：你的混天气功掌握程度还不够，需要多加练习。");

    return true;
}
}

