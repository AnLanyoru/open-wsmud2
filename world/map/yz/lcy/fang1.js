import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "东厢";
    desc = "这是丽春院二楼东面的一间卧房，里面满是女儿家的胭脂味，最里面一张大床挂着晕红的帐幔，床斜对面有一座玳瑁彩贝镶嵌的梳妆台，甚是华美无朋，绚丽夺目。一个女人坐在那里媚笑着看着你。";
    exits = { "west": "yz/lcy/erlou" };
}
