import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "大道";
this.desc = "这是一条宽敞的大道。全由乱石堆成,显然曾花了不少人力。东面是一个宽阔的练武场, 西边是一片开阔地。";
this.set_npc("bj/shenlong/xu");
this.exits = { "west": "bj/shenlong/kongdi", "east": "bj/shenlong/wuchang" };
}
