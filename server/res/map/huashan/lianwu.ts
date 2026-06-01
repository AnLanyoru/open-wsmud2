import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    desc = "这里是华山派的练武场，通常有许多华山派弟子在此习武练剑，所以不欢迎外人。北边的房屋门上挂着一块匾，上书「有所不为轩」，东面是华山派弟子存放兵器的地方。";
    exits = { "south": "huashan/yunv", "north": "huashan/keting", "east": "huashan/liangong" };
}
