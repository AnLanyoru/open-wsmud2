this.inherits(OBJ);
this.set({
    unit: "本",
    name: "内功快速入门",
    desc: "一本可以快速学会内功心法的书，虽说只能学1级",
    value: 0,
    max_level: 1,
    combined: false,
    skill: "force",
    no_drop:true
});
this.on_study = function (me, skill_base) {

    return true;
}

this.do_study = function (me, skill_base) {

    skill_base.add_exp(me, 10);
}