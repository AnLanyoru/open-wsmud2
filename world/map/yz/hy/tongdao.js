import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "甬道";
    desc = "这是一个碎石铺就的狭长甬道，两侧火把照明，墙根暗处有箭孔，地面散落着生锈的兵器。通道尽头有些亮光，出口就在前方。";
    exits = { "up": "yz/hy/jiaochang1" };

    on_enter(me) {

}
}
