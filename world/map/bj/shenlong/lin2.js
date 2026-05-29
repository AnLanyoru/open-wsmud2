import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "灌木林";
    desc = "这是一片灌木林。走了不远,你就可以看得见前面的空地了。";
    exits = { "south": "bj/shenlong/lin1", "north": "bj/shenlong/kongdi" };

    constructor() {
        super();
        this.set_npc("bj/shenlong/dushe", "bj/shenlong/zyshe");
    }
}
