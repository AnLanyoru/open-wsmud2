import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "薛慕华",
    desc: "他就是号称阎王敌的神医——薛慕华，据说他精通医理，可以起死回生。",
    title: "逍遥派 函谷八友",
    gender: 1,
    age: 50,
    per: 40,
    max_mp: 1400,
    str: 27,
    con: 27,
    dex: 27,
    int: 27,
    family: FAMILIES.XIAOYAO,
    family_level: 3
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["sword", 100],
    ["literate", 100],
    ["xiaoyaoxinfa", 100, "force"],
    ["zhemeishou", 100, ["unarmed","parry"]]);

this.on_master = function (me) {

    return true;
}
}
