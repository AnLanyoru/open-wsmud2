import { NPC } from "../../../os/char/npc.js";
import { UTIL } from "../../../os/util/util.js";
import { TASK } from "../../../os/task/task.js";

export default class extends NPC {
    name = "唐楠";
    desc = "据说唐楠是四川唐家的后代。";
    title = "当铺老板";
    gender = 1;
    age = 35;
    per = 32;
    mp = 1500;
    max_mp = 1500;
    hp = 15000;
    max_hp = 15000;
    sell_list = [];

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["unarmed", 100],
            ["sword", 1000],
            ["blade", 1000],
            ["shenlongjian", 100, "sword"]
        );
        this.set_chat_msg([
            "唐楠说道：本当铺每天中午12点清理死当，其中可是有不少宝贝！",
            "唐楠笑着说道：如果客官你着急想看明天的货，也不是不可以。",
            "唐楠说道：本当铺可以提前看货，当然要收取一点点报酬。"
        ]);
        this.add_action("refresh", "刷新货物", function (me) {
            let count = me.query_temp("ref_count", 0);
            if (count > 5) return me.notify("唐楠对你说道：这位" + me.call() + "，本店近日就这么多货物了。");
            let cash = [10, 20, 30, 40, 50, 60][count];
            me.notify("唐楠对你说道：这位" + me.call() + "，加急上货需要" + cash + "两黄金。");
            me.send_commands("give " + this.id + " " + (cash * 10000) + " money", "给唐楠" + cash + "两黄金");

        });
    }

    on_sell(me) {
    var task = TASK.GET('goods');
    if (task) return task.query_goods(me);
    return this.sell_list;
}
    on_accept(me, obj, count) {
    if (obj !== 'money') return;
    var ref_count = me.query_temp("ref_count", 0);
    if (ref_count > 5) return me.notify("唐楠对你说道：这位" + me.call() + "，本店近日就这么多货物了。");
    var task = TASK.GET('goods');
    if (!task) return me.notify("唐楠对你说道：这位" + me.call() + "，本店近日就这么多货物了。");
    var cash = [100000, 200000, 300000, 400000, 500000, 600000][ref_count];
    if (cash === count) {
        me.notify("唐楠对你说道：这位" + me.call() + "，本店的货物都在这里了，请过目。");
        task.set_goods(me, null);
        me.do_command("list", this.id);
        me.add_temp("ref_count", 1, UTIL.diff_time());
        return true;
    } else {
        me.notify("唐楠对你说道：这位" + me.call() + "，这次需要" + (cash / 10000) + "两黄金才能刷新了。");
        return false;
    }
}
}

