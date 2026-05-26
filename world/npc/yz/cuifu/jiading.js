this.inherits(NPC);
this.set({
    name: "家丁",
    desc: "崔府的家丁",
    gender: 1,
    age: 25,
    per: 15,
    mp: 100,
    max_mp: 100,
    hp: 100,
    max_hp: 100,
    score: 10
});
this.skill_map(
        ["club", 15],
        ["dodge", 15],
        ["sword", 15],
        ["parry", 15]);
this.set_objects(
    ["eq/lv0/cloth", 1, 1],
    ["eq/lv0/mugun", 1, 1]
);
this.set_drop({
    obj: "money/coin",
    min: 10,
    max: 30
}, {
        obj: ["eq/lv0/cloth", "eq/lv0/mugun"],
        odds:3000
    }, {
        obj: ["eq/lv0/jd_cloth", "eq/lv0/jd_shoes"],
        odds: 3000
    });
