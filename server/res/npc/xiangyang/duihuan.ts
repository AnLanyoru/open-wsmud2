import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "<hic>守城低保CD重置</hic>";
    desc = "减掉你今天手残领取低保的军功，重置你的守城CD，24小时有效";
    gender = 1;
    age = 45;
    per = 27;
    max_mp = 9000000;
    max_hp = 9000000;
    level = 3;
    pfm_rate = 1;
    prop = {
        gj: 20000,
        fy: 20000,
        mz: 20000,
        zj: 20000,
        ds: 30000,
        diff_sh: 10000
    };

    constructor() {
        super();
        this.add_action("xycz", "确定重置CD", function (me) {
            var t=me.query_temp('xy_cz');
            if (!t) return me.notify("这里只处理没报名却领军功，然后又后悔要重置CD的问题。");
            var jg=me.add_temp("jungong", -200);
            me.remove_temp("xy_cz");
            me.remove_temp("xy_hd");
            var obj=me.add_obj("sp/mihan");
            me.notify("已扣除掉你领取的低保军功200，重置守城CD，你获得了一个" + obj .color_name+ "。");
        });
    }

    on_kill(me) {
    return false;
}
}
