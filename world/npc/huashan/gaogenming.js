import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "高根明";
    desc = "高根明是岳不群的第五位弟子";
    title = "市井豪杰";
    gender = 1;
    age = 24;
    per = 33;
    max_mp = 51400;
    max_hp = 51400;
    str = 25;
    con = 27;
    dex = 20;
    int = 25;
    family = FAMILIES.HUASHAN;
    family_level = 2;
    prop = {
        gj: 500,
        mz: 500,
        ds:500
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 100],
            ["parry", 100],
            ["force", 100],
            ["unarmed", 100],
            ["sword", 100],
            ["literate", 100],
            ["huashanxinfa", 100, "force"],
            ["huashanjianfa", 100, "sword"],
            ["huashanquanfa", 100, "unarmed"]);
    }

    on_master(me) {
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
