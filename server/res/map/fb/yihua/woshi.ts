import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "卧室";
    desc = "这是卧室。";
    exits = {
        "northwest": "fb/yihua/yaoyue",
        "northeast": "fb/yihua/lianxing",
    };
}
