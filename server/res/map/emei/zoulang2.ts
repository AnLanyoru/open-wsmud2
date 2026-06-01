import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "走廊";
    desc = "这是一条走廊。青石板铺成的小路，两边的柱子和栏杆都是用竹子做成，在栏杆的一边种植了许多的花草，其中尤为突出的是杜鹃花，不仅生长的茂盛，并且的十分艳丽。";
    exits = { "east": "emei/guangchang", "west": "emei/liangong", "south": "emei/zoulang3", "north": "emei/zoulang4" };
}
