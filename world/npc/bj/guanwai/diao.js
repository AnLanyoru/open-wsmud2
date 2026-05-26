this.inherits(MONSTER);
this.set({
    name: "金雕",
    desc: "一只大金雕，正立在树枝上仰视长天。",
    gender: 1,
    mp: 100,
    max_mp: 100,
    hp: 4500,
    max_hp: 4500,
    score: 10
});

this.skill_map(
    ["bite", 200],
    ["bite2", 200, "bite"]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao2",
    min: 1,
    max: 4
});
this.on_enter = function (me) {
    me.notify("一只迅猛的金雕朝你俯冲过来。");
    this.do_kill(me);
}