import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "醉仙楼"
this.desc = "方圆数百里内提起醉仙楼可以说是无人不知，无人不晓。当年苏学士云游到此，对醉仙楼的花雕酒赞不绝口，欣然为其题匾，流下一段传遍海内的佳话，从此醉仙楼名声大震。楼下布置简易，顾客多是匆匆的行人，买点包子、鸡腿、米酒就赶路去了。";
this.exits = { "west": "yz/beidajie2", "up": "yz/zuixianlou2" };
this.set_npc("pub/xiaoer2");
this.no_fight = true;
}
