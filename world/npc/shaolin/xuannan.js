import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "玄难";
    desc = "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。";
    title = "少林寺方丈";
    gender = 1;
    age = 60;
    per = 26;
    mp = 400;
    score = 10;
    family = FAMILIES.SHAOLIN;
    family_level = 2;
    level = 3;
    max_mp = 827400;
    max_hp = 891500;
    prop = {
        gj: 8000,
        mz: 9000,
        ds: 9000
    };

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ],[
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["sword", 800],
            ["club", 800],
            ["blade", 800],
            ["hunyuanyiqi", 800],
            ["literate", 800],
            ["jingangquan", 800, "parry"],
            ["yijinjing", 800, "force"],
            ["weituogun", 800, "club"],
            ["ranmudao", 800, "blade"],
            ["damojian", 800, "sword"],
            ["shaolinshenfa", 800, "dodge"],
            ["yizhichan", 800, "unarmed"]);
    }

    on_master(me) {
    if (me.gender == 2) return me.notify_fail("玄难说道：阿弥陀佛，少林寺不收女弟子。");
    if (me.query_skill("yijinjing", 0) >= 500 || me.query_skill("yijinjing2", 0) >= 500) {
        return true;
    }
    if (me.query_skill("yijinjing", 0) < 500 &&  me.query_skill("yijinjing2", 0) < 500) return me.notify_fail("玄难说道：你的易筋经掌握程度还不够，需要多加练习。");
    return false;
}
}

const FAMILIES = globalThis.FAMILIES;
