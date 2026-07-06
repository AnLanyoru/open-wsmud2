import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "牟尼堂";
    desc = "这是牟尼堂。";
    exits = {
        "north": "fb/tianlong/banruo",
    };
}
