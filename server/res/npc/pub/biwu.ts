import { NPC } from "../../../core/char/npc.js";
import type { USER } from "../../../core/char/user.js";
import { WORLD } from "../../../core/world.js";

export default class extends NPC {
    name = "擂台比武报名";
    desc = "他是负责比武大赛报名的";
    gender = 1;
    age = 35;
    per = this.random(20) + 10;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.set_objects([
            "eq/lv1/junfu", 1, 1
        ]);
        this.add_action("askbiwu", "挑战", function (me) {
            me.send('从高手榜单选择你要挑战的高手。');
        });
        this.add_action("askbiwu1", "观战", function (me) {

            WORLD.COMMANDS.get('biwu')!.enter(me, 'watch');
        });
    }

    query_commands(player: USER) {
        if (this.json) return this.json;
        this.json = JSON.stringify({
            type: "item",
            desc: this.desc,
            id: this.id,
            commands: [
                {
                    cmd: "askbiwu " + this.id,
                    name: "挑战"
                },
                {
                    cmd: "askbiwu1 " + this.id,
                    name: "更新我的比武状态"
                }
            ]
        });
        return this.json;
    }
}

