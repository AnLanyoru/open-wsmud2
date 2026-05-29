import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "林间小径";
    desc = "你走在一条小径上，两旁种满了竹子，修篁森森，绿荫满地，除了竹叶声和鸟鸣声，听不到别的动静。北面似乎有一座简陋的小院。";
    exits = { "south": "wd/xiaolu", "north": "wd/xiaoyuan" };
}
