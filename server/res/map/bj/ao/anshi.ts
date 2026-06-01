import { ROOM } from "../../../../core/room/room.js";
import { OBJ } from "../../../../core/item/obj.js";

export default class extends ROOM {
    name = "暗室";
    desc = "这里是鳌拜藏宝的地方，各种珠宝玉器，珍奇异宝，名贵书籍，应有尽有，有几样尤其显眼。";
    exits = { "south": "bj/ao/shufang" };
    items = OBJ.create_by_odds([
        {
            obj: ["sp/bj/jing#1", "sp/bj/jing#2", "sp/bj/jing#3", "sp/bj/jing#4"]
        }
    ]);
}

