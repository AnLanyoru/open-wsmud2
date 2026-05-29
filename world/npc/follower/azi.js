this.inherits(NPC);
this.set({
    name: "阿紫",
    desc: "她容颜俏丽，可眼神中总是透出一股邪气。",
    title: "星宿派小师妹",
    gender: 2,
    age: 16,
    per: 34,
    str: 27,
    con: 27,
    dex: 27,
    int: 27,
    max_mp: 11500,
    max_hp: 11500,
    max_item_count: 20
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["throwing", 500]);
