import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    exits = {
        "west": "fb/baituo/changlang",
        "north": "fb/baituo/menlang",
        "south": "fb/baituo/damen",
    };
}
