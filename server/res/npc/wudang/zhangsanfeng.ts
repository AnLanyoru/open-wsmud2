import { NPC } from "../../../core/char/npc.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends NPC {
    name = "张三丰";
    desc = "这就是武当派开山鼻祖、当今武林的泰山北斗张三丰真人。但见他身穿一袭污秽的灰布道袍，身形高大异常，须发如银，脸上红润光滑，笑眯眯的甚是可亲，此外也无特异情状。";
    title = "邋遢真人";
    gender = 1;
    age = 100;
    per = 33;
    str = 30;
    con = 30;
    dex = 30;
    int = 30;
    family = FAMILIES.WUDANG;
    family_level = 1;
    level = 3;
    max_mp = 927400;
    max_hp = 991500;
    prop = {
        gj: 9000,
        mz: 9000,
        ds: 9000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv1/wd_cloth", 1, 1], ["eq/lv1/wd_jian", 1, 1]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["sword", 800],
            ["literate", 800],
            ["wudangxinfa", 800],
            ["wudangjianfa", 800],
            ["wudangchangquan", 800],
            ["taijishengong", 800, "force"],
            ["tiyunzong", 800, "dodge"],
            ["taijijian", 800, "sword"],
            ["taijiquan", 800, ["unarmed", "parry"]]);
    }

    on_master(me) {
    if (me.query_skill("taijiquan", 0) >= 500 || me.query_skill("taijiquan2", 0) >= 500) {
        if (me.query_skill("taijishengong", 0) >= 500 || me.query_skill("taijishengong2", 0) >= 500) {
            return true;
        }
    }
    if (me.query_skill("taijiquan", 0) < 500 &&  me.query_skill("taijiquan2", 0) < 500) return me.notify_fail("张三丰说道：你的太极拳掌握程度还不够，需要多加练习。");
    if (me.query_skill("taijishengong", 0) < 500 &&  me.query_skill("taijiquan2", 0) < 500) return me.notify_fail("张三丰说道：你的太极神功掌握程度还不够，还需多加努力。");
    return false;
}
}

