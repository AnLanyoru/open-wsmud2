import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "夏雪宜";
    desc = "他就是人称“金蛇郎君”的一代怪杰——夏雪宜。";
    title = "<hiy>金蛇郎君</hiy>";
    gender = 1;
    age = 25;
    per = 36;
    str = 30;
    int = 30;
    dex = 30;
    con = 15;
    mp = 20000;
    max_mp = 20000;
    hp = 20000;
    max_hp = 20000;
    level = 3;
    max_item_count = 20;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 600],
            ["parry", 600],
            ["force", 600],
            ["sword", 600],
            ["unarmed", 600]);
    }
}
