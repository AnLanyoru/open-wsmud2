import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "左全",
    desc: "这是位豪爽大方的丐帮七袋弟子，看来是个北地豪杰。",
    title: "丐帮七袋弟子",
    gender: 1,
    age: 35,
    per: 23,
    max_mp: 1110,
    max_hp: 1020,
    family: FAMILIES.GAIBANG,
    family_level: 4
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/mugun", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["club", 100],
    ["literate", 100],
    ["gaibangxinfa", 100, "force"],
    ["feiyanzoubi", 100, "dodge"],
    ["jiaohuabangfa", 100, ["club", "parry"]],
    ["taizuchangquan", 100, "unarmed"]);

this.on_master = function (me) {
    return true;
}
}
