import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大院";
    desc = "你走进大院，迎面是一个假山水池，池中立着一块巨大无比的翡翠，显然是鳌拜收刮来的宝物。水池的两旁种满了花草。北边是厨房，有一棵槐树，郁郁葱葱，遮盖了大半个院子，显得阴森恐怖。西边一条长廊走道通往后院，有几个官兵把守。";
    exits = { "west": "bj/ao/houyuan",east:"bj/ao/damen","north": "bj/ao/chufang" };

    constructor() {
        super();
        this.set_npc("bj/ao/wu");
    }
}
