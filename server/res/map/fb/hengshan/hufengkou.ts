import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "虎风口";
    exits = {
        "northwest": "fb/hengshan/guolaoling",
        "south": "fb/hengshan/daziling",
    };
}
