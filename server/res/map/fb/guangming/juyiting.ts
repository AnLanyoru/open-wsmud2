import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "聚议厅";
    desc = "这是聚议厅。";
    exits = {
        "south": "fb/guangming/lianwu",
        "north": "fb/guangming/shenghuotang",
    };
}
