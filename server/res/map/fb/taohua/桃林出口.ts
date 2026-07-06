import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "桃林出口";
    desc = "这是桃林出口。";
    exits = {
        "south": "fb/taohua/小路",
    };
}
