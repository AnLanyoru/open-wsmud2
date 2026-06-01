import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这里就是文士庄允城的旧居。自从他被朝廷抓走后,这里好象就没有人住了。一扇<cmd cmd='look men'>大门</cmd>紧锁着,周围是高高的<cmd cmd='look wall'>围墙</cmd>。一切都很干净,并没有积多少灰尘。";
    exits = {"south":"bj/zhuang/xiaolu2"};

    constructor() {
        super();
        this.set_item("men","大门","这扇门是锁着的，除非你打破它。",[
        ["break","打破",function(me){
            if(this.query_exits("north")) return me.notify("门已经被你打开了。");
            if(me.max_mp>500&&me.mp>200){
                me.add_mp(-200);
                me.send_room("$N走到门前，深吸一口气，双掌同时拍出。 \n$N只听一声轰响，$P把门震开了！");
                this.add_exit("north","bj/zhuang/dayuan");
            }else{
                me.send_room("$N走到门前，深吸一口气，双掌同时拍出。 \n$N大吼一声“开！”，结果什么也没发生。看来$P的内力不够强。");
            }
        }]
        ]);
        this.set_item("wall","院墙","墙很高，可能翻不过去。",[
        ["climb","翻墙",function(me){
            if(me.query_skill("dodge",0)>200&&me.mp>200){
                me.add_mp(-200);
                me.send_room("$N在墙前站定,深吸一口气，猛然跃起。\n只见$N足尖在墙上一点,已悠然飘落院中！");
                me.moveto("bj/zhuang/dayuan",null,me.name+"跳了进来。");
            }else{
                me.send_room("$N在墙前站定,深吸一口气，猛然跃起，可还差一大截呢,看来是轻功不够好。");
            }
        }]
        ]);
    }
}
