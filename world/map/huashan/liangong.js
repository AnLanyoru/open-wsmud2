import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "练功房";
    desc = "这里是华山派弟子练功的地方，四周放了几个兵器架，摆放了几个铜人，靠墙放了三个蒲团用来打坐练功。";
    exits = { "west": "huashan/lianwu" };

    constructor() {
        super();
        this.set_npc('pub/muren');
    }
}
