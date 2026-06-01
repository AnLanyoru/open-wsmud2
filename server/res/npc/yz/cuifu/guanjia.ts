import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "管家";
    desc = "崔府的管家，据说掌管着崔府的钥匙";
    gender = 1;
    age = 65;
    per = 15;
    mp = 250;
    max_mp = 250;
    hp = 250;
    max_hp = 250;
    score = 20;

    constructor() {
        super();
        this.set_objects(
            ["eq/lv0/cloth", 1, 1]
        );
        this.skill_map(
            ["unarmed", 20],
            ["dodge", 20],
            ["sword", 20],
            ["parry", 20]);
        this.set_drop({
            obj: "money/silver",
            min: 2,
            max: 5
        }, {
            obj: "sp/yz/yaoshi",
            odds: 5000
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/mugun"],
            odds: 3000
        });
    }
}
