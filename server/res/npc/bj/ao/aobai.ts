import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "鳌拜";
    desc = "他就是满洲第一勇士，身穿一袭金边锦缎。他身材魁梧，相貌狰狞，太阳穴高高鼓起，似乎身怀绝世武功。";
    title = "满洲第一勇士";
    gender = 1;
    age = 50;
    per = 22;
    mp = 400;
    str = 30;
    max_mp = 1000;
    hp = 3000;
    max_hp = 3000;
    score = 30;
    prop = {
        gj: 100
    };

    constructor() {
        super();
        this.set_objects([
            "eq/lv2/ao_jia", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["feiyanzoubi", 200, "dodge"],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["sword", 300],
            ["blade", 300],
            ["fuhuquan", 200, "unarmed"],
            ["hunyuanyiqi", 200, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 15
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/mugun", "eq/lv0/jian", "sp/bj/laofangkey"],
            odds: 8000
        },
            {
                obj: ["book/bc#hunyuanyiqi", "book/bc#feiyanzoubi", "book/bc#fuhuquan"],
                odds: 5000
            }, {
            obj: ["eq/lv2/ao_jia", "eq/lv2/ao_bishou"],
            odds: 1000
        }, {
            obj: "sp/npc#aobai",
            odds: 30
        }, {
            obj: "sp/fb/tiao",
            odds: 1000
        });
    }

    on_die() {
    this.send_message("\n鳌拜狂叫道：想不到我一世威名竟然毁于你手！\n鳌拜顿了一顿，叹道：唉，只可惜我的那么多宝贝啊！\n");
}
    on_enter(me) {
    me.notify("鳌拜怒道：你敢不让我睡觉，老子宰了你 ！");
    this.do_kill(me);
}
}
