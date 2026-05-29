import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "仓库管理员";
    desc = "他是帮会仓库管理员";
    gender = 1;
    age = 44;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1]);
        this.add_action("askhyd", "仓库盘点", function (me, par) {
            var pt = me.query_party();
            if (!pt) return me.notify("你还没有加入帮派。");

            me.send("帮会管理员说道：我们本周的活跃度是：" + pt.query_score() + ",每周一重置。");
            if (me.query_temp('pt_lv', 0) < 5) {
                me.send_commands("party fam", "开启帮派战", "party boss", "发送英雄帖");
            }
        });
    }
}
