import { MONSTER } from "../../../../core/char/monster.js";

export default class extends MONSTER {
    name = "<blk>黑熊</blk>";
    desc = "一只凶猛的黑熊，形体硕大，人立而行。";
    gender = 1;
    mp = 100;
    max_mp = 9000;
    hp = 18500;
    max_hp = 18500;
    score = 20;
    prop = {
        gj: 300,
        mz: 400,
        ds: 600,
        fy: 900
    };

    constructor() {
        super();
        this.skill_map(
            ["bite", 400],
            ["bite2", 400, "bite"]);
        this.set_drop({
            obj: "res/pimao2",
            min: 1,
            max: 4
        }, {
            obj: "st/xuanjing"
        }, {
            obj: "drug/xiongdan",
            odds:1000
        });
    }

    on_enter(me) {
    me.notify("一只凶猛的黑熊朝你扑了过来。");
    this.do_kill(me);
}
}
