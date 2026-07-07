import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山道";
    exits = {
        "north": "fb/hengshan/beiyuedian",
        "southeast": "fb/hengshan/guolaoling",
    };
}
