import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "史青山";
    desc = "他就是扬州城的守备，曾经是武当山的俗家弟子，不知为何吃上了朝廷饭。";
    title = "扬州守备";
    gender = 1;
    age = 35;
    per = 22;
    mp = 2000;
    max_mp = 2000;
    hp = 2000;
    max_hp = 2000;
    score = 20;

    constructor() {
        super();
        this.set_objects([
            "eq/lv1/guanfu", 1, 1
        ], [
            "eq/lv2/jiangjunjian", 1, 1
        ]);
        this.set_drop({
            obj: "money/silver",
            min: 2,
            max: 10
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/jian", "eq/lv0/dao"],
            odds: 6000
        }, {
            obj: ["eq/lv1/guanfu", "eq/lv2/jiangjunjian",
                "eq/lv1/junfu", "eq/lv1/jundao", "book/book#sword",
                "eq/lv1/qimeigun", "book/book#blade"],
            odds: 5000
        });
        this.skill_map(
            ["unarmed", 200],
            ["dodge", 200],
            ["parry", 200],
            ["sword", 200],
            ["wudangjianfa", 200, "sword"]);
    }

    on_enter(me) {
    if (me.is_player) {
        me.notify("史青山喝道：各将领听令，擅闯军营者格杀勿论！");
        if (!me.query_temp("fb/by/bing")) {
            me.set_temp("fb/by/bing", 1);
            NPC.CREATE("pub/bing", this.environment, function (bing) {
                bing.do_kill(me);
                bing.on_die = check_bing.bind(bing, me);
            }, 3);
        } else {
            this.each_item(item => {
                if (item.is("pub/bing")) {
                    item.do_kill(me);
                }
            }, this.environment);
        }
    }

}
}

function check_bing(me) {
    var ishas = false;
    this.each_item(item => {
        if (item.is("pub/bing") && item != this) {
            ishas = true;
        }
    }, this.environment);

    if (ishas) return;

    this.send_message("史青山喝道：给我拿下！");

    this.each_item(item => {

        if (item.is("pub/wujiang") || item.is("yz/shiqingshan")) {
            item.do_kill(me);
        }
    }, this.environment);
}
