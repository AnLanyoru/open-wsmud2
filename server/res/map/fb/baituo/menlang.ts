import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "门廊";
    desc = "这是门廊。";
    exits = {
        "south": "fb/baituo/liangong",
        "north": "fb/baituo/huayuan",
    };
}
