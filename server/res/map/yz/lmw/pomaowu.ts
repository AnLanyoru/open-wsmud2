import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "破茅屋";
    desc = "这是城北流氓巷的一件茅屋，里面和外面一样都是破破烂烂的，墙角乱七八糟丢着几件武器，有枪，棍，刀，不知道从哪里拣来的，屋里坐着一个人，看上去像个流氓里的小首领。";
    exits = { "south": "yz/lmw/xiangzi2" };

    constructor() {
        super();
        this.set_npc("yz/lm/lmtou");
    }
}
