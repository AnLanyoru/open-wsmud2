import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "寝室";
    desc = "这里是岳不群的寝室，岳不群在江湖上人称「君子剑」，他虽为一大派掌门，可他的卧室却布置的很简单。除了一张床，几只箱子，墙角有张化妆台，只有靠墙一张红木书桌还显得略有气派。";
    exits = { "south": "huashan/keting" };
}
