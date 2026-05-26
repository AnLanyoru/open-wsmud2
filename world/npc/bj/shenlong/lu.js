this.inherits(NPC);
this.set({
    name: "陆高轩",
    desc: "他天庭饱满,地阔方圆,容貌颇为英俊.然而满面愁容,恰似顷刻间便有杀身之祸一般.",
    title: "神龙教军师",
    gender: 1,
    age: 37,
    per: 26,
    mp: 1400,
    max_mp: 4400,
    hp: 8500,
    max_hp: 8500,
    score: 10,
    prop: {
        zj: 100,
        gj: 300
    }
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
], [
    "eq/lv0/jian", 1, 1
]);
this.skill_map(
    ["dodge", 250],
    ["parry", 250],
    ["force", 250],
    ["unarmed", 250],
    ["sword", 250],
    ["staff", 250],
    ["huagumianzhang", 250, "unarmed"],
    ["shenlongjian", 250, "sword"],
    ["yixingbufa", 250, "dodge"],
    ["shenlongxinfa", 250, "force"],
    ["shedaoqigong", 250, "parry"]);

this.set_drop({
    obj: "money/silver",
    min: 1,
    max: 5
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
    odds: 8000
}, {
    obj: ["eq/lv2/sl_cloth", "eq/lv2/sl_tou", "eq/lv2/sl_shoes", "eq/lv2/sl_shou", "eq/lv2/sl_yao"],
    odds: 2000
}, {
    obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shedaoqigong", "book/bc#shenlongjian", "book/bc#huagumianzhang"],
    odds: 5000
});
