import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "守卫";
    desc = "襄阳城的守卫者，常年驻守襄阳，勇猛异常";
    title = "<hiz>副指挥使</hiz>";
    gender = 1;
    age = 55;
    per = 33;
    max_mp = 1000000;
    max_hp = 1000000;
    level = 3;
    no_refresh = true;
    no_fight = true;
    pfm_rate = 1;
    prop = {
        gj: 12000,
        fy: 12000,
        mz: 12000,
        zj: 8700,
        ds: 12000,
        diff_sh: 6000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 1200],
            ["parry", 1200],
            ["force", 1200],
            ["unarmed", 1200],
            ["club", 1200],
            ["zhongpingqiang", 1200, ["club", "parry"]],
            ["huntianqigong", 1200, "force"],
            ["xianglongzhang", 1200, "unarmed"],
            ["feiyanzoubi", 1200, "dodge"]);
    }

    on_kill(me) {
    return false;
}
    on_die(me) {
    if (me.is_player) {
        me.add_temp('jg', -200);
        me.notify('<red>你击杀了襄阳守军，军功减少200。</red>');
    }
}
}
