import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "黄蓉";
    desc = "这便是桃花岛岛主的独生女儿。她生性跳脱飞扬，喜欢四处乱跑。";
    title = "桃花岛主之女";
    gender = 2;
    age = 18;
    per = 38;
    int = 40;
    dex = 40;
    str = 15;
    con = 15;
    max_mp = 100000;
    max_hp = 100000;
    pfm_rate = 1;
    max_item_count = 20;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["literate", 1500]);
    }
}
