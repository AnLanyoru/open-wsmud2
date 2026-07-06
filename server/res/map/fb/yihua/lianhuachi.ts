import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "莲花池";
    desc = "这是莲花池。";
    exits = {
        "east": "fb/yihua/xiaojing",
    };
}
