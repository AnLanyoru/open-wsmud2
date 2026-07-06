import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "中门";
    desc = "这是中门。";
    exits = {
        "south": "fb/songshan/chanyuan",
        "north": "fb/songshan/huimengtang",
    };
}
