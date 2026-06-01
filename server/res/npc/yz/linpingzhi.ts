import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "林平之";
    desc = "他就是「福威镖局」的少当家－－林平之。";
    title = "福威镖局少当家";
    gender = 1;
    age = 20;
    per = 34;
    mp = 1000;
    max_mp = 1000;
    hp = 1000;
    max_hp = 1000;

    constructor() {
        super();
        this.skill_map(
                ["unarmed", 150],
                ["dodge", 150],
                ["parry", 150],
                ["literate", 150]);
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
    }
}
