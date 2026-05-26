this.inherits(MONSTER);
this.set({
    name: "毒蛇",
    desc: "一只昂首挺胸，吐着信子的毒蛇正盯着你。",
    gender: 1,
    mp: 180,
    max_mp: 180,
    hp: 380,
    max_hp: 380,
    score: 5
});
this.skill_map(
    ["bite", 200],
    ["dushegongji", 200,"bite"]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao1",
    min: 1,
    max: 4
});
this.on_enter = function (me) {
    this.do_kill(me);
}