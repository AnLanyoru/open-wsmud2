import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "道童",
    desc: "他是武当派的入门弟子，看上去十几岁。",
    title: "武当派第四代弟子",
    gender: 1,
    age: 15,
    per: 33,
    max_mp: 1400,
    str: 25,
    con: 27,
    dex: 20,
    int: 25,
    family: FAMILIES.WUDANG,
    family_level: 4,
    level: 1
});
this.set_objects(["eq/lv1/wd_cloth", 1, 1]);
this.skill_map(
    ["dodge", 50],
    ["parry", 50],
    ["force", 50],
    ["unarmed", 50],
    ["sword", 50],
    ["literate", 50],
    ["wudangxinfa", 50, "force"],
    ["wudangchangquan", 50, "unarmed"]);
}
