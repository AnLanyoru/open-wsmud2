import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "广场";
    desc = "这里是卧云庵前的广场。这里虽然不能算是最大寺庙，但殿廊亭楼具全，广场两边种植了茂密的冷杉树，浓荫遍地，芳草如茵，幽雅秀美。广场中间一条青砖铺成的大道直通正殿，转过两边的树林是许多长廊，通往其他地方。";
    exits = { "east": "emei/zoulang1", "west": "emei/zoulang2", "south": "emei/dadian", "north": "emei/miaomen" };
}
