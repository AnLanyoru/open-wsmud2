import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "药铺伙计",
    desc: "他十分强壮，看上去会几分武功，对药铺生意似乎并不在乎。",
    gender: 1,
    age: 28,
    per: 22,
    mp: 400,
    max_mp: 400,
    hp:500,
    max_hp: 500,
    score: 5
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["houquan", 100,"unarmed"]);

this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 20
}, {
        obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
        odds: 8000
});
}
