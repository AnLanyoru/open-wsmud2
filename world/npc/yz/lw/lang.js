import { MONSTER } from "../../../../os/char/monster.js";

export default class extends MONSTER {
    name = "狼";
    desc = "一只野狼，后腿微屈，前腿向前伸出，摆出一副向下俯冲的架势，两只眼睛里发出幽幽的凶光";
    gender = 1;
    mp = 100;
    max_mp = 100;
    hp = 100;
    max_hp = 100;
    score = 10;
    dex = 14;
    str = 14;

    constructor() {
        super();
        this.skill_map(
            ["bite", 5]);
        this.set_drop({
            obj: "res/pimao1",
            min: 1,
            max: 4
        });
    }

    on_enter(me) {
    if (!me.query_temp('langpi')) {
        this.do_kill(me);
    } else {
        me.notify(this.name + "凑到你身边蹭了蹭。");
    }
}
}
