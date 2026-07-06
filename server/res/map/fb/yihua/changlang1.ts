import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "玫瑰廊";
    desc = "这是玫瑰廊。";
    exits = {
        "southwest": "fb/yihua/yaoyue",
        "southeast": "fb/yihua/lianxing",
        "north": "fb/yihua/changlang",
    };
}
