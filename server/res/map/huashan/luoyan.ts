import { ROOM } from "../../../core/room/room.js";
import { BASE } from "../../../core/base.js";

export default class extends ROOM {
    name = "落雁峰";
    desc = "南峰又名落雁峰，是华山最高峰。峰头题刻极多，如“太华峰头”、“竣极于天”、“袖拂天星”等，极言华岳之高。环顾四周，皆在足下。寇准诗赞曰：只有天在上，更无山与齐；举头红日近，回首白云低。传说五代时候的隐士陈抟就隐居在这里。宋太祖曾经下诏征他出山作官，他便在这里写下谢诏表说：“一片野心都被白云锁住，九重宠诏休教丹凤衔来”，表示不愿出山做官。";
    exits = { "eastdown": "huashan/zhandao" };

    constructor() {
        super();
        this.add_action("jumpup", "跳上去", function (me) {
            if (me.query_skill("dodge", 0) >= 800) {

                me.send_room("$N在绝壁前深深地吸了口气，猛地跃了起来。\n只见$N足尖在绝壁半空一点,再飞身跃起，已悠然飘落绝顶。");
                var rm = ROOM.Get("huashan/jueding");

                if (this.owner) {
                    rm = rm.query_copy(this.owner) ?? rm;
                } else {
                    if (rm.items.length > 0) {
                        rm = this.create_jueding(rm);
                        if (!rm) {
                            return me.notify("那里人太多了，你过不去。");
                        }
                    }
                }

                me.moveto(rm, null, me.name + "跳了进来。");
            } else {
                me.send_room("$N在绝壁前站定,深吸一口气，猛然跃起，可还差一大截呢,看来是轻功不够好。");
            }
        })
    }

    create_jueding(rm) {

    if (!rm.shadow_rooms) rm.shadow_rooms = [];
    for (var i = 0; i < rm.shadow_rooms.length; i++) {
        if (rm.shadow_rooms[i].items.length === 0) {
            return rm.shadow_rooms[i];
        }
    }
    var shadow = BASE.CREATE(__PATH.MAP, rm.path);
    if (shadow) {
        rm.shadow_rooms.push(shadow);
    }
    return shadow;
}
}

const __PATH = globalThis.__PATH;
