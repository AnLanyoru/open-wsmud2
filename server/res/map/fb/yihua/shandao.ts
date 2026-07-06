import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山道";
    desc = "这是山道。";
    exits = {
        "south": "fb/yihua/yihua0",
    };
}
