import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "地下石室";
    desc = "这里是地下石室的最下面一层了，四周是黑乎乎，说不出的阴深恐怖，你可以闻到强烈的腐烂的东西所发出的气味。看来还是快点离开比较好。";
    exits = { "up": "xiaoyao/shishi" };
}
