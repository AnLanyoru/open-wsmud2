import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小路";
    desc = "这是小路。";
    exits = {
        "north": "fb/piaomiao/biguan",
        "south": "fb/piaomiao/huayuan",
    };
}
