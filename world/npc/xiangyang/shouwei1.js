this.inherits(NPC);
this.set({
    name: "守卫",
    desc: "襄阳城的守卫者，常年驻守襄阳，勇猛异常",
    title: "<hio>指挥使</hio>",
    gender: 1,
    age: 65,
    per: 27,
    max_mp: 2000000,
    max_hp: 2000000,
    level: 3,
    no_refresh: true,
    no_fight: true,
    pfm_rate: 1,
    prop: {
        gj: 15000,
        fy: 15000,
        mz: 15000,
        zj: 10700,
        ds: 15000,
        diff_sh: 10000
    }
});

this.on_kill = function (me) {
    return false;
}
this.skill_map(
    ["dodge", 1500],
    ["parry", 1500],
    ["force", 1500],
    ["unarmed", 1500],
    ["club", 1500],
    ["zhongpingqiang", 1500, ["club", "parry"]],
    ["xianglongzhang", 1500, "unarmed"],
    ["huntianqigong", 1500, "force"],
    ["feiyanzoubi", 1500, "dodge"]);
this.on_die = function (me) {
    if (me.is_player) {
        me.add_temp('jg', -300);
        me.notify('<red>你击杀了襄阳守军，军功减少300。</red>');
    }
}
