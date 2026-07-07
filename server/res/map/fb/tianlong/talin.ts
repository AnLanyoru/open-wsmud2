import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "塔林";
    exits = {
        "north": "fb/tianlong/damen",
        "south": "fb/tianlong/ta",
    };
}
