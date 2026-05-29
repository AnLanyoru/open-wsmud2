import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "走廊"
this.desc = "这是一条走廊。青石板铺成的小路，两边的柱子和栏杆都是用竹子做成，在栏杆的一边种植了许多的花草，其中尤为突出的是杜鹃花，不仅生长的茂盛，并且的十分艳丽。";
this.exits = { "north": "emei/xiaowu", "south": "emei/zoulang2" };
}
