this.inherits(MONSTER);
this.set({
    name: "野狗",
    desc: "一只脏兮兮的野狗，在野外时间久了野性很强，正龇牙盯着你。",
    gender: 1,
    mp: 100,
    max_mp: 100,
    hp: 100,
    max_hp: 100,
    score: 5
});
this.skill_map(
    ["bite", 20]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao1",
    min: 1,
    max: 4
});
this.on_enter = function (me) {
    this.do_kill(me);
}