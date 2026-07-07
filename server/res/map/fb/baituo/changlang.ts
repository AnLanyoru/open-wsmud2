import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "长廊";
    exits = {
        "west": "fb/baituo/ximen",
        "east": "fb/baituo/liangong",
        "south": "fb/baituo/yaofang",
    };
}
