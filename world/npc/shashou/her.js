import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "何小二";
    desc = "他是杀手楼的弟子，负责新入门的杀手训练";
    title = "杀手教习";
    gender = 1;
    age = 25;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;
    family = FAMILIES.SHASHOU;
    family_level = 3;
    level = 1;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/fei", 1, 1]);
        this.skill_map(
            ["dodge", 100],
            ["parry", 100],
            ["force", 100],
            ["unarmed", 100],
            ["throwing", 100],
            ["literate", 100],
            ["shashouxinfa", 100, "force"],
            ["shashoubufa", 100, "dodge"],
            ["feidao", 100, "throwing"]);
        this.set_chat_msg([
            "何小二说道：江湖上的其他门派都防着我们，所以他们战斗的时候你就去浑水摸鱼吧，楼主会奖励你的。",
            "",
            ""
        ]);
    }

    on_master(me) {
   
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
