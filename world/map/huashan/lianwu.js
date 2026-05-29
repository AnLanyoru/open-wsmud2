import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "练武场"
this.desc = "这里是华山派的练武场，通常有许多华山派弟子在此习武练剑，所以不欢迎外人。北边的房屋门上挂着一块匾，上书「有所不为轩」，东面是华山派弟子存放兵器的地方。";
this.exits = { "south": "huashan/yunv", "north": "huashan/keting", "east": "huashan/liangong" };
//this.set_npc("pub/dadizi#HUASHAN");

//this.set_npc("pub/mpguanli#HUASHAN");
}
