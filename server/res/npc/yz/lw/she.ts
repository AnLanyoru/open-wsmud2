import { MONSTER } from "../../../../core/char/monster.js";

export default class extends MONSTER {
    name = "毒蛇";
    desc = "一只昂首挺胸，吐着信子的毒蛇正盯着你。";
    gender = 1;
    mp = 50;
    max_mp = 50;
    hp = 50;
    max_hp = 50;
    score = 5;
    dex = 10;
    str = 10;

    constructor() {
        super();
        this.skill_map(
            ["bite", 2]);
        this.set_drop({
            obj: "res/pimao1",
            min: 1,
            max: 4
        });
    }

    on_enter(me) {
    this.do_kill(me);
}
    on_enter(me) {
    if (me.is_player && !me.query_temp('langpi')) {
        this.do_kill(me);
    } else {
        me.notify(this.name + "朝你吐了吐信子。");
    }
}
}
