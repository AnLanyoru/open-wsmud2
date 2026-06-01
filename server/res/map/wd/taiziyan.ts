import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "太子岩";
    desc = "这是一块广场般大小的大石，上面又平又光，显然不是人力搬来，也不是人力制成。";
    exits = { "southdown": "wd/shijie1", "north": "wd/tylu" };
}
