this.inherits(NPC);
this.set({
    name: "王语嫣",
    desc: "她似有烟霞轻笼，恍入仙境，当真非尘世中人。",
    title: "<him>神仙姐姐</him>",
    gender: 2,
    age: 20,
    per: 42,
    str: 15,
    con: 15,
    dex: 15,
    int: 50,
    mp: 100,
    exp: 1000000,
    pot: 1000000,
    max_mp: 100,
    hp: 100,
    max_hp: 100,
    level: 3,
    max_item_count: 20

});
this.skill_map(
    ["literate", 10000]);
this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
        var name = me.name[0];
        if (me.gender == 1)
            me.notify("王语嫣对你微微颔首，柔声道：" + name + "公子。");
        else
            me.notify("王语嫣对你微微颔首，柔声道：" + name + "姑娘。");
    }
}