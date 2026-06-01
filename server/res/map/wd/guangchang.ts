import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "广场";
    desc = "这是一个由大石板铺成的广场，是武当弟子学习武功和互相切磋的地点。周围种满了梧桐树，一到秋天就是满地的落叶。一个年纪轻轻的道童正在打扫。北边是灵霄宫三清殿。";
    exits = { "north": "wd/sanqing", "west": "wd/shijie1" };
}
