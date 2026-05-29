import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "慧合尊者";
    desc = "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。";
    title = "少林寺第三十九代弟子";
    gender = 1;
    age = 50;
    per = 26;
    mp = 400;
    hp = 1500;
    score = 10;
    family = FAMILIES.SHAOLIN;
    family_level = 4;
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
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
                "eq/lv0/dao", 1, 1
            ]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["blade", 500],
            ["club", 500],
            ["literate", 500],
            ["weituogun", 500, "club"],
            ["ranmudao", 500, "blade"],
            ["hunyuanyiqi", 500, "force"],
            ["damojian", 500, "sword"],
            ["jingangquan", 500, "parry"],
            ["shaolinshenfa", 500, "dodge"],
            ["yizhichan", 500, "unarmed"]);
    }

    on_master(me) {
    if (me.gender == 2) return me.notify_fail("慧合尊者说道：阿弥陀佛，少林寺不收女弟子。");
    if (me.query_skill("hunyuanyiqi", 0) < 300) return me.notify_fail("慧合尊者说道：你的混元一气掌握程度还不够，需要多加练习。");
    if (me.query_skill("shaolinshenfa", 0) < 300) return me.notify_fail("慧合尊者说道：你的少林身法掌握程度还不够，需要多加练习。");
    return true;
}
}

