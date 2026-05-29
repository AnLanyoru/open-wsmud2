import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "地下石室"
this.desc = "这里是地下石室的最下面一层了，四周是黑乎乎，说不出的阴深恐怖，你可以闻到强烈的腐烂的东西所发出的气味。看来还是快点离开比较好。";
this.exits = { "up": "xiaoyao/shishi" };
}
