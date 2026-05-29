import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "镖头",
    desc: "福威镖局的镖头",
    gender: 1,
    age: 35,
    per: 22,
    mp: 100,
    max_mp: 100,
    hp: 100,
    max_hp: 100,
});
this.skill_map(
        ["unarmed", 150],
        ["dodge", 150],
        ["force", 150]);
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
}
