this.inherits(NPC);
this.set({
    name: "木头人",
    desc: "这是一个木头做的假人，用来测试伤害的",
    gender: 1,
    age: 10,
    per: 43,
    mp: 60,
    max_mp: 60,
    hp: 99999999,
    max_hp: 99999999,
    str: 1,
    con: 1,
    dex: 1,
    int:1
});
this.die = function () {

    this.clear_combat_prop();
    this.add_hp(this.max_hp);
    this.send_room('$N身上破损的木头剥落，再次神采奕奕，精气十足。\n');
    return false;
}