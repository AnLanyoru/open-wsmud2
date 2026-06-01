import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "喇嘛";
    desc = "这是一个高大喇嘛，两臂粗壮，膀阔腰圆，似乎不是中土人士。";
    gender = 1;
    age = 37;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1,
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["blade", 200],
            ["mizongxinfa", 200, "force"],
            ["dashouyin", 200, "unarmed"]);
        this.set_drop({
            obj: "money/silver",
            min: 5,
            max: 12
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        },
            {
                obj: ["book/bc#mizongxinfa", "book/bc#dashouyin"],
                odds: 3000
            });
    }

    on_enter(me) {
    if (this.is_fighting()) return;
    me.notify("喇嘛说道：你是谁，居然敢破坏大爷的好事，不想活了是不是？！");
    this.each_item(item => {
        if (item.path == this.path) {
            item.do_kill(me);
        }
    }, this.environment);
}
    on_die(killer) {
    var ishas = false;
    var dubi = null;
    this.each_item(item => {
        if (item != this && item.path == this.path) {
            ishas = true;
        } else if (item.path == "bj/tdh/dubi") {
            dubi = item;
        }
    }, this.environment);
    if (!ishas && dubi && killer) {
        var rd = this.random(killer.kar / 2) + killer.kar / 2 > 20;
        if (rd) {

            killer.notify("白衣女尼对你说道：“多谢这位" + killer.call() + "拔刀相助，贫尼感激不尽，无以为报。这里有一套神行百变身法，你若愿学，贫尼定倾囊以授。");
            killer.set_temp("fb/tdh/dubi", 1);
        } else {
            killer.set_temp("fb/tdh/dubi", 2);
            killer.notify("白衣女尼对你说道：“多谢这位" + killer.call() + "拔刀相助，贫尼感激不尽。");
        }
    }
}
}
