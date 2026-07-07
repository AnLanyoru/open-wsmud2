import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山坡";
    exits = {
        "west": "fb/guangming/banshanyao",
        "east": "fb/guangming/shanpo2",
    };
}
