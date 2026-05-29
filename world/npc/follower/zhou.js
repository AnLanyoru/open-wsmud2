this.inherits(NPC);
this.set({
    name: "周芷若",
    desc: "她秀若芝兰，淡雅脱俗，年纪虽小却十足是个绝色的美人胚子",
    title: "峨眉派第四代弟子",
    gender: 2,
    age: 17,
    per: 38,
    dex: 35,
    str: 35,
    int: 15,
    con: 15,
    exp: 1000000,
    pot: 1000000,
    max_mp:2000,
    max_hp: 2000,
    level: 3,
    max_item_count: 20
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 1000]);
this.on_master_learn = function (me, sk) {
    if (sk == "linjizhuang" || sk == "zhutianbu" || sk == "yitianjianfa" || sk == "jiuyinbaiguzhao") {

        return me.notify_fail("周芷若说道：师父教我不能让别人学会我们峨眉派的武功，师父的话我是要听的。");
    }
}
this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
        me.notify("周芷若对你微微一笑。");
    }
}