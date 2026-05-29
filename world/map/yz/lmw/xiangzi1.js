import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "小巷子";
    desc = "这里是扬州城北的一个破烂小巷子，因为在城外所以官兵一直都不大爱管，久而久之这里就成了一些大小流氓的聚集地，到处都是乌烟瘴气。墙角有几个小流氓吊儿郎当的站着看着你。";
    exits = {  "east": "yz/lmw/xiangzi2", };

    constructor() {
        super();
        this.set_npc(["yz/lm/xiaolm", 2]);
    }

    on_leave(me, dir) {
    if (dir == "east") {
        var obj = this.find_obj_bypath("yz/lm/xiaolm");
        if (obj) {
            me.notify("小流氓吊儿郎当的拦住你。");
            return false;
        }
    }
}
}
