this.inherits(NPC);
this.set({
    name: "厨师",
    desc: "他原是归安县的知县，因贪赃枉法，百姓恨之切齿，终被告发革职。他长得尖嘴猴腮，一看就知不是好人 。",
    gender: 1,
    age: 45,
    per: 19,
    mp: 100,
    max_mp: 200,
    hp: 200,
    max_hp: 200,
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100]);