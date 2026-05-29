import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "大院"
this.desc = "你走进大院，迎面是一个假山水池，池上摆着一块奇形怪状的石头，据说是当年花石纲的遗石。水池的两旁种满了花草。东边是一棵槐树，郁郁葱葱，遮盖了大半个院子，显得阴森恐怖。一条长廊走道通往后院，有几个家丁把守。";
this.exits = { "south": "yz/cuifu/caizhu", "north": "yz/cuifu/houyuan" };
this.set_npc("yz/cuifu/guanjia", [
"yz/cuifu/jiading",2
]);
this.on_leave = function (me, dir) {
    if (dir == "north") {
        var obj = this.find_by_path("yz/cuifu/guanjia");
        if (obj) {
            me.notify("管家拦住你：私人宅院，禁止入内。");
            return false;
        }
    }
}
}
