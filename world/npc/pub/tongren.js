this.inherits(NPC);
this.set({
    name: "<yel>铜人</yel>",
    desc: "这是一个铜做的假人，防御很高，用来测试伤害的",
    gender: 1,
    age: 10,
    per: 43,
    mp: 60,
    max_mp: 60,
    hp: 99999999,
    prop: {
        fy: 50000,
        diff_sh_per: 70,
        diff_sh: 12000
    },
    max_hp: 99999999,
    str: 1,
    con: 1,
    dex: 1,
    int: 1
});

this.die = function () {

    this.clear_combat_prop();
    this.add_hp(this.max_hp);
    this.send_room('$N身上破损的铜皮剥落，再次神采奕奕，精气十足。\n');
    return false;
}