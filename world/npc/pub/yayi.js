import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "衙役";
    desc = "一个高大威猛的汉子，因为久在官府做事，脸上已经磨炼得毫无表情。";
    title = "知府千金";
    gender = 1;
    age = 25;
    per = 18;
    mp = 400;
    max_mp = 400;
    hp = 4000;
    max_hp = 4000;

    constructor() {
        super();
        this.skill_map(["dodge", 5500],
                ["parry", 5500],
            ["force", 5500],
            ["unarmed", 5500],
            ["sword", 5500],
            ["changshengjue", 5500, "force"]);
    }
}
