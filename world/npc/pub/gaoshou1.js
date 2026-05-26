this.inherits(NPC);
this.set({
    name: "武林高手",
    desc: "他是一个武林高手，但是没人知道他的名字",
    gender: 1,
    age: 25,
    per: this.random(20) + 10,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,

});
this.set_objects(["eq/lv0/cloth",1,1]);
this.skill_map(
    ["force", 100],
    ["dodge", 100],
    ["parry", 100],
    ["sword", 100],
    ["blade", 100],
    ["unarmed", 100]);