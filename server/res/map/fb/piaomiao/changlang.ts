import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "长廊";
    desc = "这是长廊。";
    exits = {
        "north": "fb/piaomiao/huayuan",
        "south": "fb/piaomiao/dating",
        "east": "fb/piaomiao/wuqi",
        "west": "fb/piaomiao/liangong",
    };
}
