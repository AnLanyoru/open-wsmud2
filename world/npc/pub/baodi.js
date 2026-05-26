this.inherits(NPC);
this.set({
    name: "易直非",
    desc: "一个神秘的商人，可以帮你兑换你一直想要却得不到的道具",
    title: "神秘商人",
    gender: 1,
    age: 25,
    per: this.random(20) + 10,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400
});

this.add_action("ask3", "兑换", function (me) {

});


