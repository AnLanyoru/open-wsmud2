import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "崔莺莺";
    desc = "她长得极美，尤其是那对眼睛，媚得直可以勾人魂魄。";
    title = "财主女儿";
    gender = 2;
    age = 17;
    per = 34;
    mp = 100;
    max_mp = 100;
    hp = 100;
    max_hp = 100;

    constructor() {
        super();
        this.set_drop({
            obj: "money/silver",
            min: 1,
            max: 5
        }, {
            obj: "eq/lv1/cui_sz",
            odds: 1000
        });
        this.set_ask("东厢", function (me) {
            if (me.query_temp("fb/cuifu/yahuan") == 2) {
                me.notify("崔莺莺想了想，告诉你：我记得爹爹在东厢的柜子下面放了个小箱子。");
                me.set_temp("fb/cuifu/yahuan", 3);
                return true;
            } else if (me.query_temp("fb/cuifu/yahuan") == 4) {
                me.notify("崔莺莺说道：你不是已经找到了吗？");
                return true;
            }
            return false;
        });
    }
}
