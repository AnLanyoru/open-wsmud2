import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "思过崖";
    desc = "这里便是华山派弟子受罚思过的地方。位于玉女峰顶，正好有一小快平地，一面是深不可测的山谷、一面是陡峭的<cmd cmd='look bi'>悬壁</cmd>，零零落落的有几快山石。";
    exits = { "northdown": "huashan/xiaojing" };

    constructor() {
        super();
        this.set_item("bi", "峭壁", "你看着看着忽然发现有一处石壁上的青苔比别处少得多。不禁想....", [[
            "break", "打碎", function (me, par) {
                if (par != "bi") {
                    return;
                }
                if (this.query_exits("enter")) return me.notify("石壁已经被你打开了。");
                if (me.max_mp > 1000 && me.mp > 1000) {
                    me.add_mp(-200);
                    me.send_room("$N走到石壁前，深吸一口气，双掌同时拍出。 \n$N只听一声轰响，石壁被打开一个大洞！");
                    this.add_exit("enter", "huashan/hole");
                } else {
                    me.send_room("$N走到门前，深吸一口气，双掌同时拍出。 \n结果只听一声闷哼，$P被石壁的反弹力震得眼前一黑....");
                }
                // this.call_out(x => {
                //     this.notify("石壁的石头掉了下来，把出口又给封死了...");
                //     this.remove_exit("enter");
                // },10000);
                return true;
            }
        ]]);
    }
}
