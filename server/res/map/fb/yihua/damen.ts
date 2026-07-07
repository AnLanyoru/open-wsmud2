import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    exits = {
        "south": "fb/yihua/yihuage",
        "north": "fb/yihua/yihua1",
    };
}
