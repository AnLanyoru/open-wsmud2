import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "厨房";
    desc = "一进门，一股香气扑鼻而来，熏得你直流口水。灶台上满是油烟，一个肥肥胖胖的家伙正在炒菜, 一看就象个大厨师。";
    exits = { "south": "bj/ao/dayuan" };

    constructor() {
        super();
        this.set_npc("bj/ao/chushi");
    }
}
