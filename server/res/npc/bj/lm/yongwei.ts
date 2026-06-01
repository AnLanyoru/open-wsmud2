import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "披甲俑卫";
    desc = "身着残破铁甲，头盔遮住大半面容，仅露一双空洞眼窝。手持锈迹斑斑的长刀。";
    gender = 1;
    age = 200;
    per = 20;
    mp = 5000;
    max_mp = 5000;
    hp = 22000;
    max_hp = 22000;
    score = 20;
    prop = {
    gj: 1000,
    mz: 1500,
    fy: 2000,
    ds: 1000,
    zj: 1000,
    gjsd: 1500
};

    constructor() {
        super();
        this.skill_map(
            ["dodge", 200],
            ["parry", 250],
            ["unarmed", 300],
            ["force", 300],
            ["daidaokuilei", 380,
                ["unarmed", "parry", "force", "dodge"]]);
        this.set_drop({
            obj: "st/xuanjing",
            min: 1,
            max: 3
        }, {
            obj: ['eq/lv2/lm_cloth',
                'eq/lv2/lm_tou',
                'eq/lv2/lm_shoes',
                'eq/lv2/lm_pifeng',
                'eq/lv2/lm_pei'],
            odds: 500
        });
    }
}
