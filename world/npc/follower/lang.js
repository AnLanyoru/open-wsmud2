import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "<wht>浪翻云</wht>";
    desc = "他身形雄伟，面貌粗犷豪雄，脸目丑陋，一对黄睛似醒还醉";
    gender = 1;
    age = 38;
    per = 14;
    max_mp = 6000000;
    max_hp = 6000000;
    exp = 2300000000;
    level = 6;
    prop = {
        gj: 2000,
        mz: 2000,
        ds: 2000
    };
    max_item_count = 20;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 5000],
            ["parry", 5000],
            ["force", 5000],
            ["unarmed", 5000],
            ["sword", 5000],
            ["literate", 5000]
        );
    }
}
