import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "洪七公",
    desc: "他就是丐帮第十七任帮主，号称“北丐”的洪七公老爷子",
    title: "<hiy>北丐</hiy>",
    gender: 1,
    age: 65,
    per: 33,
    max_mp: 400000,
    max_hp: 400000,
    pfm_rate: 1,
    family: FAMILIES.GAIBANG,
    family_level: 2,
    level: 3,
    prop: {
        gj: 8000,
        mz: 8000,
        ds: 8000
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiegun", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["club", 800],
    ["literate", 800],
    ["gaibangxinfa", 800],
    ["feiyanzoubi", 800],
    ["jiaohuabangfa", 800],
    ["taizuchangquan", 800],
    ["literate", 800],
    ["huntianqigong", 800, "force"],
    ["xiaoyaoyou", 800, "dodge"],
    ["jiaohuabangfa", 800],
    ["dagoubang", 800, "club"],
    ["xianglongzhang", 800, "unarmed"]);

this.on_master = function (me) {
    if (me.query_skill("huntianqigong", 0) < 500 && me.query_skill("huntianqigong2", 0) < 500) return me.notify_fail("洪七公说道：你的混天气功掌握程度还不够，需要多加练习。");
    if (me.query_skill("dagoubang", 0) < 500 && me.query_skill("dagoubang2", 0) < 500) return me.notify_fail("洪七公说道：你的打狗棒掌握程度还不够，还需多加努力。");
    return true;
}
}
