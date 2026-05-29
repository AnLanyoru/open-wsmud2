import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "密林";
    desc = "你继续深入，这里面树木更加茂密，杂草丛生，抬头不见天日，你小心翼翼的防备着，说不定有更加危险的野兽。";
    exits = { "east": "yz/lw/milin", "west": "yz/lw/milin3" };

    constructor() {
        super();
        this.set_npc(["yz/lw/lang", 2]);
    }
}
