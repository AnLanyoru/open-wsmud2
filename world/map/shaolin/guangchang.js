import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "广场"
this.desc = "这里是少林寺前的广场，整个广场由大块的青石铺成，极为平坦。但因年代久远，都有些破损。丛丛小草从石板的缝隙中长了出来。广场周围都是密密的松树林，四角上各放了几块石碑，字迹都甚为模糊。正前方黄墙碧瓦，飞檐翘檩，正中一道二丈来宽，三丈来高的朱红杉木包铜大门，上方一块大匾，龙飞凤舞地书着『少林寺』三个大字";
this.exits = { "north": "shaolin/shanmen" };
//this.set_npc("shaolin/qingle");
}
