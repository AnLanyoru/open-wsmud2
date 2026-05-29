import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "密林"
this.desc = "你走入树林，这里面树木茂密，杂草丛生，抬头不见天日，你得时刻防备着，说不定突然就有只毒蛇窜了出来。";
this.exits = { "east": "yz/lw/shangu", "west": "yz/lw/milin2" };
this.set_npc(["yz/lw/she", 2]);
}
