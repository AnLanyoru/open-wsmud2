this.inherits(NPC);
this.set({
    name: "守卫",
    desc: "襄阳城的守卫者，常年驻守襄阳，勇猛异常",
    title: "<hig>守卫</hig>",
    gender: 1,
    age: 25,
    per: 27,
    max_mp: 100000,
    max_hp: 100000,
    level: 3,
    no_refresh: true,
    no_fight: true,
    pfm_rate: 1,
    prop: {
        gj: 2000,
        fy: 2000,
        mz: 2000,
        zj: 300,
        ds: 1000
    }
});

this.on_kill = function (me) {
    return false;
}
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["club", 300],
    ["zhongpingqiang", 300, ["club", "parry"]],
    ["huntianqigong", 300, "force"],
    ["taizuchangquan", 300, "unarmed"],
    ["feiyanzoubi", 300, "dodge"]);

this.on_die = function (me) {
    if (me.is_player) {
        me.add_temp('jg', -30);
        me.notify('<red>你击杀了襄阳守军，军功减少30。</red>');
    }
}