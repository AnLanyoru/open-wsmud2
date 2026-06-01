import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "灌木林";
    desc = "这是一片灌木林。你对这样一个孤岛上竟有这样大一片<cmd cmd='look bush'>灌木林</cmd>感到非常吃惊.前面根本没有路, 四周的密林中长满了杂草。";
    exits = { "south": "bj/shenlong/haitan" };

    constructor() {
        super();
        this.set_npc("bj/shenlong/dushe", "bj/shenlong/zyshe");
        this.set_item("bush", "灌木林","这是一片很大的灌木林，把路都给挡住了。", [
            "kan", "砍掉", function (me) {
                if (this.query_exits("north")) return me.notify("已经砍好了，快过去吧！");
                if (!me.query_weapon()) return me.notify("你不拿武器怎么砍？");
                me.send_room("$N抽出$W,对着灌木丛一阵乱砍。");
                if (me.mp > 300) {
                    me.send_room("$N累得气喘吁吁,终于砍出一条小路。");
                    this.add_exit("north","bj/shenlong/lin2");
                } else {
                    me.send_room("$N累得气喘吁吁,也没砍开一条路来。");
                }
            }
        ]);
    }
}
