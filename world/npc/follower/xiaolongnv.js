this.inherits(NPC);
this.set({
    name: "小龙女",
    title: "<wht>玉女素心</wht>",
    desc: "她清丽异常，但也许是长居古墓之故，面色略白。",
    gender: 2,
    age: 20,
    per: 40,
    str: 15,
    con: 15,
    dex: 15,
    int: 40,
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
    ["literate", 300], ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["whip", 300]);
