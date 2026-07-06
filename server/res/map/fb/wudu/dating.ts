import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大厅";
    desc = "这是大厅。";
    exits = {
        "west": "fb/wudu/lianwu",
        "east": "fb/wudu/huayuan",
    };
}
