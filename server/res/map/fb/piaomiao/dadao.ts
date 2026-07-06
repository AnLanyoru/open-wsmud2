import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "青石大道";
    desc = "这是青石大道。";
    exits = {
        "north": "fb/piaomiao/damen",
        "south": "fb/piaomiao/xianchou",
    };
}
