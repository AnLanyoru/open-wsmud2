import { MONSTER } from "../../../../core/char/monster.js";

export default class extends MONSTER {
    name = "石甲蝎";
    desc = "通体青黑如岩石，甲壳上布满尖刺，尾钩泛着幽蓝毒光。";
    gender = 0;
    age = 200;
    per = 20;
    mp = 5000;
    max_mp = 5000;
    hp = 14000;
    max_hp = 14000;
    score = 10;
    prop = {
    gj: 900,
    mz: 1100,
    ds: 900,
    fy: 900,
    zj: 900,
    gjsd: 2000
};

    constructor() {
        super();
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
    }

    on_enter(me) {
    if (me.is_player && !this.fight_type) {
        this.do_kill(me);
    }
}
}
