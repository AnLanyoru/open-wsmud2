import { NPC } from "../../../os/char/npc.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends NPC {
    name = "守卫";
    desc = "他是杀手楼的守卫，警惕的观望着四周";
    gender = 1;
    age = 25;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;
    family = FAMILIES.SHASHOU;

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
    }

    on_leave(me, dir) {
    if (dir == "north") {
        if (me.family != FAMILIES.NONE && me.family != FAMILIES.SHASHOU) {
            me.notify("守卫拦住你：这位" + me.call() + "，请留步。");
            return false;
        }
       
    }

}
}

