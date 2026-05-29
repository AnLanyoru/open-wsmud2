import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "清乐比丘";
    desc = "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含着无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。";
    title = "少林寺第四十代弟子";
    gender = 1;
    age = 30;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;
    family = FAMILIES.SHAOLIN;
    family_level = 6;
    level = 1;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
                "eq/lv0/mugun", 1, 1
            ]);
        this.skill_map(
            ["dodge", 100],
            ["parry", 100],
            ["force", 100],
            ["unarmed", 100],
            ["sword", 100],
            ["club", 100],
            ["literate", 100],
            ["hunyuanyiqi", 100, "force"],
            ["weituogun", 100, "club"],
            ["shaolinshenfa", 100, "dodge"],
            ["fuhuquan", 100, "unarmed"]);
    }

    on_master(me) {
    if (me.gender == 2) return me.notify_fail("清乐比丘说道：阿弥陀佛，少林寺不收女弟子。");
    return true;
}
}

