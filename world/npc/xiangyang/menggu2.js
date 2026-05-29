import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "蒙古兵";
    desc = "蒙古兵的千夫长，狡勇善战";
    title = "<hiz>千夫长</hiz>";
    gender = 1;
    age = 65;
    per = 27;
    max_mp = 2000000;
    max_hp = 2000000;
    level = 3;
    no_refresh = true;
    pfm_rate = 1;
    prop = {
        gj: 12000,
        fy: 12000,
        mz: 12000,
        zj: 9000,
        ds: 12000,
        diff_sh: 6000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 1200],
            ["parry", 1200],
            ["force", 1200],
            ["unarmed", 1200],
            ["club", 1200],
            ["mengguqiangfa", 1200, ["club", "parry"]],
            ["longxianggong", 1200, ["unarmed", "force"]],
            ["feiyanzoubi", 1200, "dodge"]);
    }
}
