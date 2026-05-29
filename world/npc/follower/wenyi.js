import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "温仪",
    desc: "这是一个美如天仙的女子，眉宇间却是仿佛隐藏着深忧。",
    title: "温家小姐",
    gender: 2,
    age: 19,
    per: 37,
    dex: 25,
    str: 25,
    int: 25,
    con: 25,
    exp: 800000,
    pot: 800000,
    max_mp: 2000,
    max_hp: 2000,
    level: 3,
    max_item_count: 20
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 800]);
this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
       
    }
}
}
