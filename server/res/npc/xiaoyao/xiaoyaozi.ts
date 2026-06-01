import { NPC } from "../../../core/char/npc.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends NPC {
    name = "逍遥子";
    desc = "他就是逍遥派开山祖师、但是因为逍遥派属于一个在江湖中的秘密教派，所以他在江湖中不是很多人知道，但其实他的功夫却是。。。。他年满七旬，满脸红光，须眉皆白。";
    title = "逍遥派开山祖师";
    gender = 1;
    age = 80;
    per = 40;
    str = 27;
    con = 27;
    dex = 27;
    int = 27;
    family = FAMILIES.XIAOYAO;
    family_level = 1;
    level = 3;
    max_mp = 827400;
    max_hp = 991500;
    prop = {
        gj: 8000,
        mz: 8000,
        ds: 9000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["blade", 800],
            ["sword", 800],
            ["literate", 800],
            ["xiaoyaoxinfa", 800],
            ["beimingshengong", 800, "force"],
            ["lingboweibu", 800, "dodge"],
            ["ruyidao", 800, "blade"],
            ["zhemeishou", 800, "parry"],
            ["xiaowuxianggong", 800, "sword"],
            ["liuyangzhang", 800, "unarmed"]);
    }

    on_master(me) {
    if (me.query_skill("beimingshengong", 0) >= 500 || me.query_skill("beimingshengong2", 0) >= 500) {
        if (me.query_skill("lingboweibu", 0) >= 500 || me.query_skill("lingboweibu2", 0) >= 500) {
            return true;
        }
    }
    if (me.query_skill("beimingshengong", 0) < 500) return me.notify_fail("逍遥子说道：你的北冥神功掌握程度还不够，需要多加练习。");
    if (me.query_skill("lingboweibu", 0) < 500) return me.notify_fail("逍遥子说道：你的凌波微步掌握程度还不够，需要多加练习。");
    return false;
}
}

