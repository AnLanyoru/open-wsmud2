import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "地牢"
this.desc = "这里逼仄压抑，混杂着霉味与腐烂气息扑面而来。两侧是密密麻麻的铁牢，栅栏上锈迹斑斑，不少牢门虚掩着，里面或堆着白骨，或蜷缩着气息奄奄的囚徒。";
this.exits = { "up": "yz/hy/yishiting" };

this.set_npc("yz/hy/yin");
}
