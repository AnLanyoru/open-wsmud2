import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "打铁铺"
this.desc = "这是一家简陋的打铁铺，中心摆着一个火炉，炉火把四周照得一片通红，你一走进去就感到浑身火热。墙角堆满了已完工和未完工的菜刀、铁锤、铁棍、匕首、盔甲等物。一位铁匠满头大汗挥舞着铁锤，专心致志地在打铁。";
this.exits = { "north": "yz/dongdajie2"};

this.no_fight = true;
this.set_npc("pub/tiejiang");
}
