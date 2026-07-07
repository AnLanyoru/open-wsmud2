import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "花径";
    exits = {
        "south": "fb/yihua/yihua1",
        "north": "fb/yihua/shandao",
    };
}
