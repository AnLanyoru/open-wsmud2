import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "练功房";
    desc = "这里是峨眉派弟子的练功房，虽然简陋，但布置极为用心，还有些女人家的零碎物件，靠墙放了几个蒲团供人打坐练功。";
    exits = { "east": "emei/zoulang2" };

    constructor() {
        super();
        this.set_npc('pub/muren');
    }
}
