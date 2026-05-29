import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "蒙古兵";
    desc = "蒙古兵的百夫长，狡勇善战";
    title = "<hiy>百夫长</hiy>";
    gender = 1;
    age = 65;
    per = 27;
    max_mp = 500000;
    max_hp = 500000;
    level = 3;
    no_refresh = true;
    pfm_rate = 1;
    prop = {
        gj: 7000,
        fy: 7000,
        mz: 7000,
        zj: 7000,
        zj: 1500,
        ds: 4000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 900],
            ["parry", 900],
            ["force", 900],
            ["unarmed", 900],
            ["club", 900],
            ["mengguqiangfa", 900, ["club", "parry"]],
            ["longxianggong", 900, ["unarmed", "force"]],
            ["feiyanzoubi", 900, "dodge"]);
    }
}
