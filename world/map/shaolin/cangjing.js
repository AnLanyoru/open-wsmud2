import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "藏经阁"
this.desc = "不愧为中原佛法的总源，少林寺此处藏经之富，天下罕有其匹。这里都是密密麻麻，高及顶棚的书架，书架间仅有容身一人通行的空隙。几排大书架中间，间隔地放着数丈长的书桌。目光及处，你看到桌上放了几本佛经。";
this.exits = { "east": "shaolin/zhulin1" };
}
