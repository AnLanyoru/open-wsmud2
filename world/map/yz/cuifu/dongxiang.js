import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "东厢";
    desc = "这是一个昏暗的房间，窗户都被钉死。地上放着皮鞭、木棍等刑具，显然这是财主私立公堂，折磨仆人、丫鬟的所在。一个丫鬟被绳子绑着，浑身赤裸跪在地上哭哭啼啼，身上是一道道的伤口。墙角有个<cmd cmd='look gui'>柜子</cmd>，好像放了不少东西。";
    exits = {  "west": "yz/cuifu/houyuan" };

    constructor() {
        super();
        this.set_npc("yz/cuifu/yahuan");
        this.set_item("gui", "柜子", "一个黑乎乎的柜子，里面不知道放了什么。", [[
            "search", "搜索", function (me, par) {
                if (par != "gui") {
                    return;
                }
                if (me.query_temp("fb/cuifu/yahuan") == 3) {
                    me.send_room("$N仔细翻了翻柜子，从柜子下面找到一个小箱子。");
                    me.set_temp("fb/cuifu/yahuan",4);
                    var obj = me.add_obj("sp/yz/box1", 1);
                    if (obj) {
                        me.send_room("$N从得到了一个 " + obj.color_name + "。");
                    }
        
                } else {
                    me.notify("你胡乱在柜子里上面翻了几下，什么都没发现。");
                }
                return true;
            }
        ]]);
    }
}
