import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "苏梦清",
    desc: "她是峨眉派俗家弟子，一位面容清瘦，身材娇小的女子",
    title: "峨眉派第五代弟子",
    gender: 2,
    age: 28,
    per: 38,
    max_mp: 1400,
    family: FAMILIES.EMEI,
    family_level: 5,
    level: 2,
    max_mp: 51400,
    max_hp: 51400,
    prop: {
        gj: 500,
        mz: 500,
        ds: 500
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["sword", 100],
    ["literate", 100],
    ["emeixinfa", 100, "force"],
    ["zhutianbu", 100, "dodge"],
    ["jindingzhang", 100,"unarmed"]);

this.on_master = function (me) {
    if (me.gender != 2) return me.notify_fail("苏梦清对你说道：这位"+me.call()+"，我们峨眉派不收男弟子的。");
    return true;
}
}
