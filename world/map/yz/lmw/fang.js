import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "头目房间";
    desc = "流氓头目的房子，在小巷子里属于比较豪华的存在，一个五大三粗的人大马金刀的坐在头椅上。";
    exits = { "west": "yz/lmw/xiangzi3" };

    constructor() {
        super();
        this.set_npc("yz/lm/zhao");
    }
}
