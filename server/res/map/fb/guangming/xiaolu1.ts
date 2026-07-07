import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "林间小路";
    exits = {
        "south": "fb/guangming/banshanyao",
        "north": "fb/guangming/guangmingding",
    };
}
