import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "空地";
    desc = "这是一片空地，四周都是乱石，杂草丛生。北边是一间小屋，南面是深深的灌木林，东面有一条工整的大道, 西面是一片草坪。";
    exits = { "south": "bj/shenlong/lin2", "north": "bj/shenlong/xiaowu", "east": "bj/shenlong/dadao" };

    constructor() {
        super();
        this.set_npc(["bj/shenlong/dizi", 2]);
    }
}
