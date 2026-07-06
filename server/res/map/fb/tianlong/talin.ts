import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "塔林";
    desc = "这是塔林。";
    exits = {
        "north": "fb/tianlong/damen",
        "south": "fb/tianlong/ta",
    };
}
