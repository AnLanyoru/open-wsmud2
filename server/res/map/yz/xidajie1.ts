import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西大街";
    desc = "这是一条宽阔的青石板街道，向东西两头延伸。西大街是衙门所在，行人稀少，静悄悄地很是冷清。东边是一个热闹的广场。南边是兵营。北边就是衙门了。";
    exits = {"west":"yz/xidajie2","north":"yz/yamen","south":"yz/leitai/ltx","east":"yz/guangchang"};
}
