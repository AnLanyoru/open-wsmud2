this.inherits(MONSTER);
this.name = "石甲蝎";
this.desc = "通体青黑如岩石，甲壳上布满尖刺，尾钩泛着幽蓝毒光。";
this.gender = 0;

this.age = 200;
this.per = 20;

this.mp = 5000;
this.max_mp = 5000;
this.hp = 14000;
this.max_hp = 14000;
this.score = 10;
this.prop = {
    gj: 900,
    mz: 1100,
    ds: 900,
    fy: 900,
    zj: 900,
    gjsd: 2000
};

this.skill_map(
    ["dodge", 200],
    ["parry", 250],
    ["force", 300],
    ["bite", 300],
    ["xiezigongji", 280, "bite"]);
this.set_drop({
    obj: "st/xuanjing",
    min: 1,
    max: 3
});


this.on_enter = function (me) {
    if (me.is_player && !this.fight_type) {
        this.do_kill(me);
    }
}