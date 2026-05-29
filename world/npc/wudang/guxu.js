import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "谷虚道长",
    desc: "他就是俞莲舟的弟子谷虚道长。\n他今年四十岁，主管武当派的俗事。",
    title: "武当派第三代弟子",
    gender: 1,
    age: 45,
    per: 33,
    max_mp: 1400,
    str: 25,
    con: 27,
    dex: 20,
    int: 25,
    family: FAMILIES.WUDANG,
    family_level: 3,
    level: 1
});
this.set_objects(["eq/lv1/wd_cloth", 1, 1], ["eq/lv1/wd_jian", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["sword", 100],
    ["literate", 100],
    ["wudangxinfa", 100, "force"],
    ["wudangjianfa", 100, "sword"],
    ["wudangchangquan", 100,"unarmed"]);

this.on_master = function (me) {
    return true;
}
}
