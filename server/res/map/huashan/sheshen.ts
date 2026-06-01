import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "舍身崖";
    desc = "这是一段极窄极险的山崖，四周云雾飞绕，下面渊深无底。如不小心，一失足掉下去，只怕连骨头都找不到。边上有个小山洞";
    exits = { "westdown": "huashan/zhenyue" };

    constructor() {
        super();
        this.add_action("jumpdown", "跳下去", function (me) {
            me.notify("你心一横，双眼一闭就从山崖上跳了下去。");
            var rm = ROOM.Get("huashan/qiaobi");

            if (this.owner) rm = rm.query_copy(this.owner) ?? rm;
            // var pt = me.query_party();
            // if (pt && pt.is_battle('HUASHAN')) {
            //     rm = rm.query_copy2(me);
            // }

            me.moveto(rm, me.name + "心一横，双眼一闭就从山崖上跳了下去。", me.name + "从山上跳了下来。");
            if (me.query_skill("dodge", 0) >= 300) {
                me.notify("穿过层层云雾，你跳到一处平台上面。");

            } else {
                me.add_hp(-me.max_hp);
                me.die();
            }
        })
    }
}
