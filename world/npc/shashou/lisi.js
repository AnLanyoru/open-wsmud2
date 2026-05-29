import { NPC } from "../../../os/char/npc.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(NPC);
this.set({
    name: "李四",
    desc: "他是杀手楼的银牌杀手，看上去是一个走在大街上你绝对不会看上一眼的普通人",
    title: "鬼手",
    gender: 1,
    age: 43,
    per: 26,
    mp: 400,
    max_mp: 400,
    hp: 1500,
    max_hp: 1500,
    score: 10,
    family: FAMILIES.SHASHOU,
    family_level: 2,
    level: 1
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/fei", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["throwing", 500],
    ["literate", 500],
    ["shashengjue", 500, "force"],
    ["taxuexunmei", 500, "dodge"],
    ["feidao", 500, "throwing"],
    ["chuanxinzhang", 500, "unarmed"]);
this.on_master = function (me) {

    if (me.query_skill("shashouxinfa", 0) < 100) return me.notify_fail("李四说道：你的杀手心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("feidao", 0) < 100) return me.notify_fail("李四说道：你的飞刀掌握程度还不够，还需多加努力。");
    return true;
}

this.set_chat_msg([
    "李四说道：江湖上的其他门派都防着我们，所以他们战斗的时候你就去浑水摸鱼吧，楼主会奖励你的。", 
    "",
    ""
]);
}
