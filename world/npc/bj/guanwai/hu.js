this.inherits(MONSTER);
this.set({
    name: "东北虎",
    desc:"一只矫捷的斑斓猛虎，形体巨大，状极威猛，雄伟极了",
    gender: 1,
    mp: 100,
    max_mp: 100,
    hp: 6500,
    max_hp: 6500,
    score: 10
});
this.skill_map(
    ["bite", 270],
    ["bite2", 270,"bite"]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao2",
    min: 1,
    max: 4
});
this.on_enter = function(me) {
    me.notify("一只凶猛的东北虎朝你扑了过来。");
    this.do_kill(me);
}