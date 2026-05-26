this.inherits(NPC);
this.set({
    name: "青青",
    desc: "她是一个梳着高髻，身着羽衣的绝色美人，如同壁画上的仙子。",
    title: "<hiw>狐女</hiw>",
    gender: 2,
    age: 20,
    per: 38,
    dex: 40,
    str: 15,
    int: 40,
    con: 15,
    exp: 5000000,
    pot: 5000000,
    max_mp: 2000,
    max_hp: 2000
});
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 3000]);
