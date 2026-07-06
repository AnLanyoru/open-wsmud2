import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "独尊厅";
    desc = "这是独尊厅。";
    exits = {
        "north": "fb/piaomiao/changlang",
    };
}
