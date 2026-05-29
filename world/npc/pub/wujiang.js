import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "武将",
    desc: "他站在那里，的确有说不出的威风。",
    gender: 1,
    age: 35,
    per: this.random(30) + 10,
    mp: 2500,
    max_mp: 2500,
    hp: 2500,
    max_hp: 2500,
    score: 15
}); this.set_objects([
    "eq/lv1/guanfu", 1, 1
], [
    "eq/lv1/jundao", 1, 1
]); this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 5
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/jian", "eq/lv0/dao"],
    odds: 6000
}, {
    obj: ["eq/lv1/guanfu", "eq/lv1/junfu", "book/book#sword", "eq/lv1/jundao", "book/book#blade"],
    odds: 3000
});
this.skill_map(
    ["unarmed", 190],
    ["dodge", 190],
    ["parry", 190],
    ["blade", 190]);
}
