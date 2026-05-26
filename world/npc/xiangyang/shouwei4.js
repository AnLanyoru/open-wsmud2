this.inherits(NPC);
this.set({
    name: "守卫",
    desc: "襄阳城的守卫者，常年驻守襄阳，勇猛异常",
    title: "<hic>副都头</hic>",
    gender: 1,
    age: 35,
    per: 27,
    max_mp: 200000,
    max_hp: 200000,
    level: 3,
    no_refresh: true,
    no_fight: true,
    pfm_rate: 1,
    prop: {
        gj: 5000,
        fy: 5000,
        mz: 5000,
        zj: 800,
        ds: 2000
    }
});

this.on_kill = function (me) {
    return false;
}
this.skill_map(
    ["dodge", 600],
    ["parry", 600],
    ["force", 600],
    ["unarmed", 600],
    ["club", 600],
    ["zhongpingqiang", 600, ["club", "parry"]],
    ["huntianqigong", 600, "force"],
    ["taizuchangquan", 600, "unarmed"],
    ["feiyanzoubi", 600, "dodge"]);
this.on_die = function (me) {
    if (me.is_player) {
        me.add_temp('jg', -50);
        me.notify('<red>你击杀了襄阳守军，军功减少50。</red>');
    }
}
