import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "苏星河";
    desc = "此人就是号称聪辩老人的苏星河，据说他能言善辩，是一个武林中的智者，而他的武功也是无人能知。";
    title = "聪辩老人";
    gender = 1;
    age = 60;
    per = 40;
    str = 27;
    con = 27;
    dex = 27;
    int = 27;
    family = FAMILIES.XIAOYAO;
    family_level = 2;
    max_mp = 327400;
    max_hp = 391500;
    prop = {
        gj: 4000,
        mz: 4000,
        ds: 4000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["blade", 500],
            ["literate", 500],
            ["xiaoyaoxinfa", 500],
            ["beimingshengong", 500, "force"],
            ["lingboweibu", 500, "dodge"],
            ["ruyidao", 500, "blade"],
            ["zhemeishou", 500, "parry"],
            ["liuyangzhang", 500, "unarmed"]);
    }

    on_master(me) {

    if (me.query_skill("xiaoyaoxinfa", 0) < 100) return me.notify_fail("苏星河说道：你的逍遥心法掌握程度还不够，需要多加练习。");
    return true;
}
}

