import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "厨房";
    desc = "这里满屋的饭香和茶香混合在一起，散发出的阵阵味道沁人心脾。只见屋内有两个峨眉的俗家女弟子正在忙着煮茶、做饭。由于峨眉广种花草因而创出了一套独特的作茶方法";
    exits = { "west": "emei/zoulang1" };
}
