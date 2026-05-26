this.inherits(NPC);
this.set({
    name: "蒙古兵",
    desc: "进攻襄阳城的蒙古兵，狡勇善战",
    title: "<hig>蒙古兵</hig>",
    gender: 1,
    age: 35,
    per: 27,
    max_mp: 30000,
    max_hp: 30000,
    level: 1,
    no_refresh: true,
    pfm_rate: 1,
    prop: {
        gj: 2000,
        fy: 2000,
        mz: 2000,
        zj: -700
    }
});
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["club", 300],
    ["mengguqiangfa", 300, ["club", "parry"]],
    ["mengguxinfa", 300, "force"],
    ["dashouyin", 300, "unarmed"],
    ["feiyanzoubi", 300, "dodge"]);
