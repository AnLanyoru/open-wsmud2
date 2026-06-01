import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "史松";
    desc = "这是一个精壮汉子，军官模样，腰间围一条长鞭。";
    title = "黑龙鞭";
    gender = 1;
    age = 42;
    per = 33;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;
    score = 45;

    constructor() {
        super();
        this.set_chat_msg([
            "史松一拍腰间的软鞭，说道:在下黑龙鞭史松，奉鳌少保将令，捉拿天地会反贼。",
            "史松大叫: 反了，反了！通通给我拿下！",
            "史松说道: 鳌少保天生神勇，武功盖世，曾在北京街上一拳打死一头疯牛，就凭你也配和鳌少保动手？"
        ]);
        this.skill_map(
            ["unarmed", 120],
            ["dodge", 120],
            ["parry", 120],
            ["whip", 120], ["yunlongbian", 120, "whip"]);
        this.set_objects(
            ["eq/lv1/guanfu", 1, 1],
            ["eq/lv2/hl_bian", 1, 1]
        );
        this.set_drop({
            obj: "money/silver",
            min: 2,
            max: 10
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/jian", "eq/lv0/whip"],
            odds: 6000
        }, {
            obj: ["eq/lv1/guanfu", "eq/lv1/lm_cloth", "eq/lv1/lm_shoes", "eq/lv1/lm_shou", "eq/lv1/lm_jian"],
            odds: 4000
        }, {
            obj: ["book/bc#yunlongbian", "book/book#whip"],
            odds: 4000
        }, {
            obj: ["eq/lv2/hl_bian"],
            odds: 1000
        });
    }

    on_enter(me) {
    me.notify("史松怒道：哪里来的反贼敢打扰大爷的好事！");
}
    on_die() {
    var item = this.environment.find_by_path("yz/lcy/maoshiba");
    if (item) {
        this.call_out(getAllFromMe, 100, item, this.environment.items);
    }
}
}

function getAllFromMe(mao, items) {
    mao.send_message("茅十八哈哈大笑道：狗贼，你也有今天！");
    for (var i = 0; i < items.length; i++) {
        if (items[i].fromid == this.id) {
            var objs = items[i].items;
            if (objs) {
                for (var j = 0; j < objs.length; j++) {
                    mao.send_message("茅十八从" + items[i].color_name + "里拿出了" + objs[j].unit_name() + "。");
                }
            }
            objs.length = 0;
            break;
        }
    }
}
