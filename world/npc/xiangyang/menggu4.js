import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "蒙古兵";
    desc = "蒙古兵的十夫长，狡勇善战";
    title = "<hic>十夫长</hic>";
    gender = 1;
    age = 65;
    per = 27;
    max_mp = 200000;
    max_hp = 200000;
    level = 2;
    no_refresh = true;
    pfm_rate = 1;
    prop = {
        gj: 4000,
        fy: 4000,
        mz: 4000,
        ds: 2000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 600],
            ["parry", 600],
            ["force", 600],
            ["unarmed", 600],
            ["club", 600],
            ["mengguqiangfa", 600, ["club", "parry"]],
            ["longxianggong", 600, ["unarmed", "force"]],
            ["feiyanzoubi", 600, "dodge"]);
    }
}
