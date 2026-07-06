import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "密室";
    desc = "这是密室。";
    exits = {
        "west": "fb/yihua/xiaojing",
    };
}
