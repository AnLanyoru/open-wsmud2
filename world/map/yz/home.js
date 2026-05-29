import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这里是扬州城私人住宅的大门，因为在衙门旁边，所以治安非常好，四周整治的干干净净，一扇气派的大门紧闭，大头高大的石狮子镇守两侧，旁边站着一位老管家。";
    exits = { "south": "yz/xidajie2", "enter": "home/yuanzi" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("pub/guanjia");
    }
}
