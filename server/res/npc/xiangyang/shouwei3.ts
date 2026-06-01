import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "守卫";
    desc = "襄阳城的守卫者，常年驻守襄阳，勇猛异常";
    title = "<hiy>都头</hiy>";
    gender = 1;
    age = 45;
    per = 27;
    max_mp = 500000;
    max_hp = 500000;
    level = 3;
    no_refresh = true;
    no_fight = true;
    pfm_rate = 1;
    prop = {
        gj: 9000,
        fy: 9000,
        mz: 9000,
        zj: 3500,
        ds: 6000
    };

    constructor() {
        super();
        this.skill_map(
            ["dodge", 900],
            ["parry", 900],
            ["force", 900],
            ["unarmed", 900],
            ["club", 900],
            ["zhongpingqiang", 900, ["club", "parry"]],
            ["huntianqigong", 900, "force"],
            ["xianglongzhang", 900, "unarmed"],
            ["feiyanzoubi", 900, "dodge"]);
    }

    on_kill(me) {
    return false;
}
    on_die(me) {
    if (me.is_player) {
        me.add_temp('jg', -100);
        me.notify('<red>你击杀了襄阳守军，军功减少100。</red>');
    }
}
}
