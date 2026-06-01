import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "二楼";
    desc = "你站在丽春院二楼的过道上，满耳的淫声秽响不绝如缕。墙上挂着几幅古往今来的风流才子，红尘佳人的画像，四周的莺莺燕燕在朝你招手，你恨不得立马跑过去。";
    exits = { "east": "yz/lcy/fang1", "down": "yz/lcy/dating", "west": "yz/lcy/fang2" };

    constructor() {
        super();
        this.set_npc("yz/lcy/guigong");
    }
}
