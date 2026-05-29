import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "蒙哥";
    desc = "蒙古国的大汉，拖雷长子，率领蒙古大军南征北战，屡立战功";
    title = "<hio>蒙古大汗</hio>";
    gender = 1;
    age = 55;
    per = 27;
    max_mp = 8000000;
    max_hp = 8000000;
    level = 3;
    no_refresh = true;
    pfm_rate = 1;
    prop = {
        gj: 20000,
        fy: 20000,
        mz: 25000,
        zj: 20000,
        ds: 20000,
        diff_sh: 12000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 2000],
            ["parry", 2000],
            ["force", 2000],
            ["unarmed", 2000],
            ["club", 2000],
            ["mengguqiangfa", 2000, ["club", "parry"]],
            ["longxianggong", 2000, ["unarmed", "force"]],
            ["feiyanzoubi", 2000, "dodge"]);
    }
}
