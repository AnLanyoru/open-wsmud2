this.inherits(NPC);
this.set({
    name: "周芷若",
    desc: "她是一位容貌美丽，端庄可爱的姑娘。虽然年纪很轻，但在峨眉派中是出类拔萃的人物。",
    title: "峨眉派第四代弟子",
    gender: 2,
    age: 20,
    per: 37,
    dex: 30,
    str: 30,
    max_mp:32400,
    max_hp: 32400,
    family: FAMILIES.EMEI,
    family_level: 3,
    level: 3,
    prop: {
        gj: 4000,
        mz: 4000,
        ds:4000
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["sword", 500],
    ["literate", 500],
    ["emeixinfa", 500],
    ["linjizhuang", 500, "force"],
    ["zhutianbu", 500, "dodge"],
    ["huifengjian", 500],
    ["jiuyinbaiguzhao", 500, ["parry", "unarmed"]],
    ["huifengjian", 500, "sword"],
    ["jindingzhang", 500]);

this.on_master = function (me) {
    if (me.gender != 2) return me.notify_fail("周芷若对你哼了道：再不走小心杀了你！");
    if (me.query_skill("linjizhuang", 0) < 300 && me.query_skill("linjizhuang2", 0) < 300) return me.notify_fail("周芷若说道：你的临济十二庄掌握程度还不够，需要多加练习。");
    if (me.query_skill("huifengjian", 0) < 300) return me.notify_fail("周芷若说道：你的回风拂柳剑掌握程度还不够，需要多加练习。");
    return true;
}