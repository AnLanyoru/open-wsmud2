this.inherits(NPC);
this.set({
    name: "小师妹",
    desc: "她是宗门里最小的师妹，长得是娇柔可爱",
    gender: 2,
    age: 19,
    per: 37,
    dex: 20,
    str: 15,
    int: 40,
    con: 15,
    exp: 15000000,
    pot: 15000000,
    max_mp: 600000,
    max_hp: 600000,
    level: 3,
    max_item_count: 20
});
this.set_objects(["eq/lv0/jian", 1, 1], ["res/cao#18", 1], ["res/cao#22", 1], ["res/cao#19", 1], ["res/cao#20", 1], ["res/cao#21", 1]);
this.skill_map(
    ["dodge", 1500],
    ["parry", 1500],
    ["force", 1500],
    ["unarmed", 1500],
    ["throwing", 1500],
    ["sword", 1500],
    ["literate", 1500],
    ["lianyao", 1500]);


this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
        me.notify("小师妹朝你微微一笑。");
    }
}
