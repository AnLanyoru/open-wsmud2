import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "独尊厅大门";
    desc = "这是独尊厅大门。";
    exits = {
        "south": "fb/piaomiao/dadao",
    };
}
