this.inherits(NPC);
this.set({
    name: "<hiw>木头人</hiw>",
    desc: "这是一个木头做的假人，用来训练新手用的",
    gender: 1,
    age: 10,
    per: 22,
    mp: 60,
    max_mp: 60,
    hp: 60,
    max_hp: 60,
    dex: 20,
    str:4
});
this.set_drop({
    obj: "sp/new/mutou"
});