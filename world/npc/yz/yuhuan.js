import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "程玉环";
    desc = "她就是程知府的独生女儿，长得如花似玉，貌赛天仙的程玉环。\n据说她曾经在武当门下学过剑法。";
    title = "知府千金";
    gender = 2;
    age = 18;
    per = 42;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;

    constructor() {
        super();
        this.skill_map(
                ["dodge", 100],
                ["parry", 100],
                ["force", 100],
                ["unarmed", 100],
                ["sword", 100],
                ["literate", 100],
                ["taijijian", 100],
                ["taijiquan", 100]);
    }
}
