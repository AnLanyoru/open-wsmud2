this.inherits(NPC);
this.set({
    name: "张无忌",
    desc: "江湖中不世出的少年英雄",
    title: "明教教主",
    gender:1,
    age: 17,
    per: 38,
    dex: 15,
    str: 40,
    int: 15,
    con: 40,
    exp: 1000000,
    pot:1000000,
    max_mp: 20000,
    max_hp: 20000,
    level: 3
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 500]);

this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
        me.notify("张无忌对你嘿嘿一笑。");
    }
}