this.inherits(NPC);
this.set({
    name: "静心",
    desc: "她一位中年出家道姑，道冠高拢，慈眉善目",
    title: "峨眉派第四代弟子",
    gender: 2,
    age: 48,
    per: 33,
    max_mp: 100000,
    max_hp: 100000,
    family: FAMILIES.EMEI,
    family_level: 4,
    level: 2,
    prop: {
        gj: 2000,
        mz: 2000,
        ds: 2000
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 300],
    ["emeixinfa", 300],
    ["linjizhuang", 300, "force"],
    ["zhutianbu", 300, "dodge"],
    ["huifengjian", 300, "sword"],
    ["jindingzhang", 300, "unarmed"]);

this.on_master = function (me) {
    if (me.gender != 2) return me.notify_fail("静心对你说道：这位" + me.call() + "，我们峨眉派不收男弟子的。");
    if (me.query_skill("emeixinfa", 0) < 100) return me.notify_fail("静心说道：你的峨眉心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("jindingzhang", 0) < 100) return me.notify_fail("静心说道：你的金顶绵掌掌握程度还不够，需要多加练习。");
    return true;
}