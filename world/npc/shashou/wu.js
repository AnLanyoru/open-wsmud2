import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "雾中楼";
    desc = "他是杀手楼的楼主雾中楼，他看上去平平常常一个老头，两眼却湛然若神";
    title = "杀手楼主";
    gender = 1;
    age = 67;
    per = 33;
    max_mp = 20000;
    str = 30;
    con = 30;
    dex = 30;
    int = 30;
    family = FAMILIES.SHASHOU;
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
        this.set_objects(["eq/lv0/cloth", 1, 1]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["throwing", 800],
            ["literate", 800],
            ["shashengjue", 800, "force"],
            ["taxuexunmei", 800, "dodge"],
            ["mantianhuayu", 800, "throwing"],
            ["chuanxinzhang", 800, "unarmed"]);
    }

    on_master(me) {

    if (me.query_skill("shashengjue", 0) < 500 && me.query_skill("shashengjue2", 0) < 500) return me.notify_fail("雾中楼说道：你的杀生决掌握程度还不够，需要多加练习。");
    if (me.query_skill("taxuexunmei", 0) < 500 && me.query_skill("taxuexunmei2", 0) < 500) return me.notify_fail("雾中楼说道：你的踏雪寻梅掌握程度还不够，还需多加努力。");
    return true;
}
}

