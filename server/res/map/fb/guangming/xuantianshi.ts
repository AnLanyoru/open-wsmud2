import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "悬天石";
    desc = "这是悬天石。";
    exits = {
        "west": "fb/guangming/shanpo2",
    };
}
