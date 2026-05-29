import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "暗道"
this.desc = "这是丐帮 极其秘密的地下通道，乃用丐帮几辈人之心血掘成。 ";
this.exits = { "west": "gaibang/andao1", "east": "gaibang/mishi" };
////this.set_npc("pub/mpguanli#GAIBANG");
}
