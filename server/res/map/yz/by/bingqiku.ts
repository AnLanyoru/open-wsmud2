import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";
import { OBJ } from "../../../../core/item/obj.js";

export default class extends ROOM {
    name = "兵器库";
    desc = "这里是兵器库，到处银光闪闪，让人眼花缭乱。宝刀、宝剑、金箍棒，大刀、长剑、哨棒，短刀、短剑、短棍，各色各样的兵器应有尽有，你一时不知道挑什么好。";
    exits = { "north": "yz/by/bingying" };

    constructor() {
        super();
        this.add_action("search", "搜索", function (me) {

            if (me.query_temp("by_search")) {
                if (me.equipment && me.equipment[0] && me.equipment[0].is('eq/lv1/qianjinquan')) {
                    me.notify("你仔细搜了一圈，发现兵器库的后墙有一个形状十分眼熟的孔洞。");
                    return me.send_commands('pushmen', '塞进去');

                }
                return me.notify("你仔细搜了下，发现这里已经已经被洗劫一空了，剩下的都是些破铜烂铁。");
            }
            var odds = [
                {
                    obj: "st/xuanjing",
                    min: 1,
                    max: 10
                },
                {
                    obj: ["st/st_blu#0", "st/st_gre#0", "st/st_red#0", "st/st_yel#0"],
                    min: 1,
                    max: 3
                },
                {
                    obj: ["st/st_blu#1", "st/st_gre#1", "st/st_red#1", "st/st_yel#1"],
                    odds: 3000
                },
                {
                    obj: ["book/book#blade", "book/book#sword", "book/book#dodge", "book/book#parry", "book/book#force"],
                    odds: 5000
                },
            ];
            me.set_temp("by_search", 1, 24 * 3600000);
            var items = OBJ.create_by_odds(odds);
            for (var i = 0; i < items.length; i++) {
                var obj = me.add_obj(items[i]);
                if (obj) {
                    me.notify("你找到了" + items[i].unit_name() + "。");
                }
            }

        });
        this.add_action('pushmen', null, function (me) {
            if (me.equipment && me.equipment[0] && me.equipment[0].is('eq/lv1/qianjinquan')) {

                me.send('你将手上的' + me.equipment[0].color_name + "严丝合缝的塞入墙上的孔洞，轻轻一扭，只听到咔嚓几声，地板打开一个大洞。");

                return this.add_exit('down', 'yz/by/tongdao');

            }
            return me.send('你要打什么？');
        });
        this.add_action('lkfb', null, function (me, par) {

            WORLD.COMMANDS['cr'].enter(me, 'over');

            me.moveto(ROOM.Get('yz/hy/tongdao'));
            me.send('你从兵器库钻入一个狭长的甬道。');
            me.enable_area();
        });
    }

    on_leave(me, dir) {
    if (dir === 'down') {
        me.notify('你即将离开这个副本进入公共区域，是否确认？');
        me.send_commands('lkfb', '确定离开');
        return false;
    }

}
}

