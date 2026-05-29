import { MONSTER } from "../../../../os/char/monster.js";

export default class extends MONSTER {
    name = "毒蛇";
    desc = "一只昂首挺胸，吐着信子的毒蛇正盯着你。";
    gender = 1;
    mp = 180;
    max_mp = 180;
    hp = 380;
    max_hp = 380;
    score = 5;

    constructor() {
        super();
        this.skill_map(
            ["bite", 200],
            ["dushegongji", 200,"bite"]);
        this.set_drop({
            obj: "res/pimao1",
            min: 1,
            max: 4
        });
    }

    on_enter(me) {
    this.do_kill(me);
}
}
