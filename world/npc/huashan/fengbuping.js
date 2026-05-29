import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "封不平";
    desc = "封不平是华山剑宗第一高手，满脸戾气一张黄焦焦的面皮。";
    title = "狂风快剑";
    gender = 1;
    age = 40;
    per = 33;
    max_mp = 1400;
    str = 27;
    con = 27;
    dex = 27;
    int = 27;
    family = FAMILIES.HUASHAN;
    family_level = 1;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["literate", 500],
            ["huashanxinfa", 500, "force"],
            ["huashanjianfa", 500],
            ["feiyanhuixiang", 500, "dodge"],
            ["kuangfengkuaijian", 500,"sword"],
            ["huashanquanfa", 500, "unarmed"]);
    }

    on_master(me) {

    if (me.query_skill("huashanxinfa", 0) < 100) return me.notify_fail("封不平说道：你的华山心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("huashanjianfa", 0) < 200) return me.notify_fail("封不平说道：你的华山剑法掌握程度还不够，需要多加练习。");
    return true;
}
}

